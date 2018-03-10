var ContractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "checkCurrentDonations",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_itemIdx",
                "type": "uint256"
            },
            {
                "name": "_buyerInfo",
                "type": "string"
            }
        ],
        "name": "buyItem",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_itemIdx",
                "type": "uint256"
            }
        ],
        "name": "confirmItemReceived",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "idx",
                "type": "uint256"
            }
        ],
        "name": "viewItemForSale",
        "outputs": [
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_itemIdx",
                "type": "uint256"
            }
        ],
        "name": "cancelSale",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_itemDescription",
                "type": "string"
            },
            {
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "registerItemForSale",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "checkItemsForSaleLength",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "checkBalance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "withdrawDonations",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "checkTotalDonations",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_itemDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_price",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "registerItem",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_idx",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "_itemDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "itemBought",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_itemIdx",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "itemDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "confirmItem",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "donationMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "_itemIdx",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "itemDescription",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "_time",
                "type": "uint256"
            }
        ],
        "name": "itemCanceled",
        "type": "event"
    }
];

var ContractAddress = "0xe007467b8d301a391361882b75becaa265de20c4";