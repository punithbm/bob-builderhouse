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
        with open('hello_bitcoin_contract_abi.json', 'r') as abi_definition:
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