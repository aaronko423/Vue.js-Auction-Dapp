import web3 from './web3';

const abi = [
    {
      constant: true,
      inputs: [],
      name: "state",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          name: "_beneficiary",
          type: "address"
        },
        {
          name: "_title",
          type: "string"
        },
        {
          name: "_startPrice",
          type: "uint256"
        },
        {
          name: "_description",
          type: "string"
        },
        {
          name: "_biddingTime",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      constant: false,
      inputs: [],
      name: "placeBid",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "returnAuctionBeneficiary",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "returnHighestBid",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "returnHighestBidder",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "returnAuctionInfo",
      outputs: [
        {
          name: "",
          type: "string"
        },
        {
          name: "",
          type: "uint256"
        },
        {
          name: "",
          type: "string"
        },
        {
          name: "",
          type: "uint256"
        },
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "transferToBene",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function"
    },
    {
      constant: false,
      inputs: [],
      name: "returnBid",
      outputs: [],
      payable: true,
      stateMutability: "payable",
      type: "function"
    }
  ]; // THE ABI

// Creating contract instance
export default address => {
  const instance = new web3.eth.Contract(abi, address);
  return instance;
};