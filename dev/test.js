const Blockchain = require('./blockchain')

const coin = new Blockchain()

const blockchain = {
    "chain": [
      {
        "index": 1,
        "timestamp": 1645410100195,
        "transactions": [
          
        ],
        "nonce": 777,
        "hash": "0",
        "previousBlockHash": "0"
      },
      {
        "index": 2,
        "timestamp": 1645463718535,
        "transactions": [
          
        ],
        "nonce": 18140,
        "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
        "previousBlockHash": "0"
      },
      {
        "index": 3,
        "timestamp": 1645463724515,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "XX00XX",
            "recipient": "00d3133092bd11eca1d01baedddb7b77",
            "transactionID": "d7dd5b70933911eca1d01baedddb7b77"
          }
        ],
        "nonce": 33143,
        "hash": "00005e6ae7316ebc30dbc5fe99e8474aa8c2d875e777803ce35de304e8092257",
        "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
      },
      {
        "index": 4,
        "timestamp": 1645463785959,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "XX00XX",
            "recipient": "00d3133092bd11eca1d01baedddb7b77",
            "transactionID": "db694150933911eca1d01baedddb7b77"
          },
          {
            "amount": 23,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "f58b2a80933911eca1d01baedddb7b77"
          },
          {
            "amount": 455,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "f8b456f0933911eca1d01baedddb7b77"
          },
          {
            "amount": 15,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "fb3bc520933911eca1d01baedddb7b77"
          }
        ],
        "nonce": 103021,
        "hash": "0000be90c5316cd98f8f6529d83cb1d84d5e1761f37378f87e0c10688eaa9bb7",
        "previousBlockHash": "00005e6ae7316ebc30dbc5fe99e8474aa8c2d875e777803ce35de304e8092257"
      },
      {
        "index": 5,
        "timestamp": 1645463820094,
        "transactions": [
          {
            "amount": 6.25,
            "sender": "XX00XX",
            "recipient": "00d3133092bd11eca1d01baedddb7b77",
            "transactionID": "0008dd90933a11eca1d01baedddb7b77"
          },
          {
            "amount": 2,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "0afafd50933a11eca1d01baedddb7b77"
          },
          {
            "amount": 67,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "0dbab990933a11eca1d01baedddb7b77"
          },
          {
            "amount": 89,
            "sender": "DF7F78DF8DF78DF",
            "recipient": "DDFER89ER89ER89",
            "transactionID": "0feefeb0933a11eca1d01baedddb7b77"
          }
        ],
        "nonce": 293662,
        "hash": "0000a26aa200153a92378ea453632be971a6b1a44b492042f859f3b79491f171",
        "previousBlockHash": "0000be90c5316cd98f8f6529d83cb1d84d5e1761f37378f87e0c10688eaa9bb7"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 6.25,
        "sender": "XX00XX",
        "recipient": "00d3133092bd11eca1d01baedddb7b77",
        "transactionID": "14619b10933a11eca1d01baedddb7b77"
      }
    ],
    "currentNodeURL": "http://localhost:3001",
    "networkNodes": [
      
    ]
  }

console.log(coin.chainIsValid(blockchain.chain))