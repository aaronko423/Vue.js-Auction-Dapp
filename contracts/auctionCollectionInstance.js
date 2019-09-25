import web3 from './web3';

const address = '0xcc3b2BFB9d5E557727d8794986e51aFb9A7E9406'; // CAN BE REPLACED WITH A CONTRACT ADDRESS OBTAINED FROM MIGRATION ON GANACHE
const abi = [
    {
      constant: true,
      inputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      name: "auctions",
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
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: "beneficiary",
          type: "address"
        },
        {
          indexed: false,
          name: "title",
          type: "string"
        },
        {
          indexed: false,
          name: "startPrice",
          type: "uint256"
        },
        {
          indexed: false,
          name: "description",
          type: "string"
        }
      ],
      name: "AuctionCreated",
      type: "event"
    },
    {
      constant: false,
      inputs: [
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
      name: "createAuction",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "returnAllAuctions",
      outputs: [
        {
          name: "",
          type: "address[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ]; // THE ABI

const instance = new web3.eth.Contract(abi, address);

export default instance;