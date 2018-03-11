var ContractAddress = "0x4e5cbb455a1592bac1d59c611578080b18e94ad7";

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
				"name": "_itemTitle",
				"type": "string"
			},
			{
				"name": "_itemDescription",
				"type": "string"
			},
			{
				"name": "_itemTag",
				"type": "string"
			},
			{
				"name": "_itemPicture",
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
		"name": "getBuyerDetails",
		"outputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "string"
			},
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
				"type": "string"
			},
			{
				"name": "",
				"type": "string"
			},
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
			},
			{
				"name": "",
				"type": "address"
			},
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
			}
		],
		"name": "cancelSale",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
				"name": "_idx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_itemTitle",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_itemDescription",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_itemTag",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_itemPicture",
				"type": "string"
			},
			{
				"indexed": false,
				"name": "_price",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_seller",
				"type": "address"
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
				"name": "_buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_buyerInfo",
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

var IPFS_SETTINGS = {
    host: 'localhost',
    port: 5001
}