export const BtcMarketplaceAbi = [
  {
    inputs: [
      {
        internalType: "contract IRelay",
        name: "_relay",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "bitcoinAddress",
        type: "tuple",
      },
    ],
    name: "btcSellOrderBtcSellOrderAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "orderId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sellAmountBtc",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyingToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
    ],
    name: "btcSellOrderSuccessfullyPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "btcSuccessfullySendtoDestination",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "bitcoinAddress",
        type: "tuple",
      },
    ],
    name: "ordinalSellOrderBtcSellOrderAccepted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "txId",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        indexed: false,
        internalType: "struct BtcBobMarketPlace.OrdinalId",
        name: "ordinalID",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyingToken",
        type: "address",
      },
    ],
    name: "ordinalSellOrderSuccessfullyPlaced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "ordinalSuccessfullySendtoDestination",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "bitcoinAddress",
        type: "tuple",
      },
    ],
    name: "acceptBtcSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "bitcoinAddress",
        type: "tuple",
      },
    ],
    name: "acceptOrdinalSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "btcSellOrders",
    outputs: [
      {
        internalType: "uint256",
        name: "sellAmountBtc",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "askingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "btcSeller",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "btcBuyer",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "isOrderAccepted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "version",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "inputVector",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "outputVector",
            type: "bytes",
          },
          {
            internalType: "bytes4",
            name: "locktime",
            type: "bytes4",
          },
        ],
        internalType: "struct BitcoinTx.Info",
        name: "transaction",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "merkleProof",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "txIndexInBlock",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "bitcoinHeaders",
            type: "bytes",
          },
        ],
        internalType: "struct BitcoinTx.Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "completeBtcSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes4",
            name: "version",
            type: "bytes4",
          },
          {
            internalType: "bytes",
            name: "inputVector",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "outputVector",
            type: "bytes",
          },
          {
            internalType: "bytes4",
            name: "locktime",
            type: "bytes4",
          },
        ],
        internalType: "struct BitcoinTx.Info",
        name: "transaction",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "merkleProof",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "txIndexInBlock",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "bitcoinHeaders",
            type: "bytes",
          },
        ],
        internalType: "struct BitcoinTx.Proof",
        name: "proof",
        type: "tuple",
      },
    ],
    name: "completeOrdinalSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ordinalSellOrders",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "txId",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct BtcBobMarketPlace.OrdinalId",
        name: "ordinalID",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "askingToken",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "txOutputIndex",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "txOutputValue",
            type: "uint64",
          },
        ],
        internalType: "struct BitcoinTx.UTXO",
        name: "utxo",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "ordinalSeller",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "scriptPubKey",
            type: "bytes",
          },
        ],
        internalType: "struct BtcBobMarketPlace.BitcoinAddress",
        name: "ordinalBuyer",
        type: "tuple",
      },
      {
        internalType: "bool",
        name: "isOrderAccepted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "sellAmountBtc",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyingToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
    ],
    name: "placeBtcSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "txId",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "index",
            type: "uint32",
          },
        ],
        internalType: "struct BtcBobMarketPlace.OrdinalId",
        name: "ordinalID",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            internalType: "uint32",
            name: "txOutputIndex",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "txOutputValue",
            type: "uint64",
          },
        ],
        internalType: "struct BitcoinTx.UTXO",
        name: "utxo",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "buyAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "buyToken",
        type: "address",
      },
    ],
    name: "placeOrdinalSellOrder",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdcContractAddress",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
