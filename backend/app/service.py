import json

from django.conf import settings

from web3 import Web3, Account
from web3.middleware import geth_poa_middleware

class ChainService:
    def __init__(self):
        self.web3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_RPC_URL))
        self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)
        self.contract_address = Web3.to_checksum_address(settings.BLOCKCHAIN_CONTRACT_ADDRESS)
        self.account = Account.from_key(settings.ACCOUNT_PRIVATE_KEY)
        with open('btc_bob_market_place_abi.json', 'r') as abi_definition:
            self.contract_abi = json.load(abi_definition)
        self.contract = self.web3.eth.contract(address=self.contract_address, abi=self.contract_abi)
    def is_connected(self):
        return self.web3.isConnected()
    
    def claim_token(self, address):
        nonce = self.web3.eth.get_transaction_count(self.account.address)
        amount_in_ether = 0.01
        amount_in_wei = self.web3.to_wei(amount_in_ether, 'ether')
        tx = {
            'from': self.account.address,
            'chainId': int(settings.BLOCKCHAIN_ID),
            'nonce': nonce,
            'to': address,
            'value': amount_in_wei,
            'gas': 21000,  # Gas limit for a standard Ether transfer
            'gasPrice': self.web3.to_wei('50', 'gwei')
        }
        signed_txn = self.account.sign_transaction(tx)
        txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return self.web3.to_hex(txn_hash)
    
    def send_transaction(self, function_name, *args):
        nonce = self.web3.eth.get_transaction_count(self.account.address)
        contract_function = self.contract.functions[function_name](*args)
        transaction = contract_function.build_transaction({
            'from': self.account.address,
            'chainId': int(settings.BLOCKCHAIN_ID),
            'gas': 2000000,
            'gasPrice': self.web3.to_wei('50', 'gwei'),
            'nonce': nonce,
        })
        signed_txn = self.account.sign_transaction(transaction)
        txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return self.web3.to_hex(txn_hash)

    def get_tx_receipt(self, tx_hash):
        try:
            # print(self.web3.eth)
            # Fetch the transaction receipt using its hash
            tx_receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash)
            # print("logs", tx_receipt.logs)
            return tx_receipt, None
        except Exception as e:
            print(f"Error fetching transaction receipt: {e}")
            return None, e
    
    def get_native_token_balance(self, address):
        balance_wei = self.web3.eth.get_balance(address)
        balance_ether = self.web3.from_wei(balance_wei, 'ether')
        return balance_ether
    
    def get_token_balance(self, address, token_address):
        token_abi = '''
        [
            {
                "constant":true,
                "inputs":[{"name":"_owner","type":"address"}],
                "name":"balanceOf",
                "outputs":[{"name":"balance","type":"uint256"}],
                "type":"function"
            }
        ]
        '''
        # Setup the contract
        token_contract = self.web3.eth.contract(address=token_address, abi=token_abi)

        # Call the balanceOf function
        balance = token_contract.functions.balanceOf(address).call()
        return balance
    
    def get_order_id(self, tx_hash):
        order_details = {}
        tx = self.web3.eth.get_transaction_receipt(tx_hash)
        # for event_name in self.contract.events:
        # event_abi = [event for event in self.contract_abi if event['type'] == 'event' and event['name'] == 'btcSellOrderSuccessfullyPlaced'][0]
        # event_signature_hash = self.web3.keccak(text="btcSellOrderSuccessfullyPlaced(uint256,uint256,uint256)").hex()
        event = self.contract.events.btcSellOrderSuccessfullyPlaced
        for log in tx.logs:
            try:
                decoded_log = event().process_log(log)
                if decoded_log and decoded_log.args:
                    order_details['order_id'] = decoded_log.args.orderId
                    order_details['sell_amount_btc'] = decoded_log.args.sellAmountBtc
                    order_details['buy_amount'] = decoded_log.args.buyAmount
            except Exception as e:
                print(e)
        return order_details
    
    def approve_token(self, token_address):
        token_abi = [
            {
                "constant": False,
                "inputs": [
                    {"name": "_spender", "type": "address"},
                    {"name": "_value", "type": "uint256"}
                ],
                "name": "approve",
                "outputs": [{"name": "", "type": "bool"}],
                "type": "function"
            },
        ]
        contract = self.web3.eth.contract(address=token_address, abi=token_abi)
        max_allowance = 2**256 - 1
        nonce = self.web3.eth.get_transaction_count(self.account.address)
        transaction = contract.functions.approve(self.contract_address, max_allowance).build_transaction({
            'from': self.account.address,
            'chainId': int(settings.BLOCKCHAIN_ID),
            'gas': 70000,
            'gasPrice': self.web3.to_wei('5', 'gwei'),
            'nonce': nonce,
        })
        signed_txn = self.account.sign_transaction(transaction)
        txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return self.web3.to_hex(txn_hash)
    
    def send_non_native_token(self, token_address, address, amount):
        token_abi = [
            {
                "constant": False,
                "inputs": [
                    {"name": "_to", "type": "address"},
                    {"name": "_value", "type": "uint256"}
                ],
                "name": "transfer",
                "outputs": [{"name": "", "type": "bool"}],
                "type": "function"
            },
        ]
        amount = self.web3.to_wei(amount, 'ether')
        token_contract = self.web3.eth.contract(address=token_address, abi=token_abi)
        nonce = self.web3.eth.get_transaction_count(self.account.address)
        transaction = token_contract.functions.transfer(address, amount).build_transaction({
            'from': self.account.address,
            'chainId': int(settings.BLOCKCHAIN_ID),
            'gas': 100000,
            'gasPrice': self.web3.to_wei('5', 'gwei'),
            'nonce': nonce,
        })
        signed_txn = self.account.sign_transaction(transaction)
        txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
        return self.web3.to_hex(txn_hash)

