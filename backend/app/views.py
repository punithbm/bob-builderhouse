from django.http import JsonResponse
from rest_framework.decorators import api_view
from decouple import config
from django.conf import settings

from app import decorator, models, serializers
from bob import constants as const

from .service import ChainService
import requests


@api_view(['POST'])
@decorator.valid_json
def AcceptBtcSellOrder(request):
    data = request.input_data
    service = ChainService()
    btc_address = "tb1qh28hd2vx273g596xl6wag37z0ss3qsvtr3mlkq"
    btc_address = btc_address.encode('utf-8')
    tx_hash = service.send_transaction(
        'acceptBtcSellOrder',
        data.get('order_id'),
        (btc_address, ),
    )
    response = {"tx_hash": tx_hash}
    # receipt, err = service.get_tx_receipt(tx_hash)
    # response['status'] = "success" if receipt and receipt['status'] else "failed"
    return JsonResponse(response)

@api_view(['POST'])
@decorator.valid_json
def GetTransactionStatus(request):
    data = request.input_data
    service = ChainService()
    response = {"tx_hash": data.get('tx_hash')}
    receipt, err = service.get_tx_receipt(data.get('tx_hash'))
    response['status'] = "success" if receipt and receipt['status'] else "failed"
    return JsonResponse(response)


@api_view(['GET'])
def GetBitCoinBalance(request, address):
    url = config("UNISAT_API") + f"address/{address}/balance"

    payload = {}
    headers = {
    'Authorization': 'Bearer ' + config('UNISAT_API_KEY')
    }

    response = requests.request("GET", url, headers=headers, data=payload)
    return JsonResponse(response.json())

@api_view(['GET'])
def GetBobTokensBalance(request, address):
    response = {}
    service = ChainService()
    response['balance'] = service.get_native_token_balance(address)
    tokens = []
    usdc_token = {
        'address': '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d',
        'symbol': 'USDC',
        'decimal': 18,
        'balance': service.get_token_balance(address, '0x27c3321E40f039d10D5FF831F528C9CEAE601B1d')
    }
    tokens.append(usdc_token)
    wbtc_token = {
        'address': '0x2868d708e442A6a940670d26100036d426F1e16b',
        'symbol': 'WBTC',
        'decimal': 8,
        'balance': service.get_token_balance(address, '0x2868d708e442A6a940670d26100036d426F1e16b')
    }
    tokens.append(wbtc_token)
    response['tokens'] = tokens
    return JsonResponse(response)

@api_view(['POST'])
@decorator.valid_json
def ClaimToken(request):
    data = request.input_data
    service = ChainService()
    tx_hash = service.claim_token(data.get('address'))
    response = {"tx_hash": tx_hash}
    return JsonResponse(response)

@api_view(['GET'])
def GetOrderId(request, tx_hash):
    service = ChainService()
    response = service.get_order_id(tx_hash)
    return JsonResponse(response)