# Simple Auction Dapp on Vue.js

# Instructions on how to run/test the project

After cloning repo from GitHub:

(1) 'sudo npm install' on project folder to download the dependencies
(2) 'truffle migrate --reset' to migrate contracts into local blockchain (Ganache)
(3) obtain contract address from truffle migration, plug address into "auctionCollectionInstance.js" file and assign it to "const address"
(4) 'npm run dev' to serve the application with hot reload
(5) view the short Dapp demo video 

For unit testing only:

(1) 'Un-comment' out the 2_migration_auction.js file (in migrations folder) for unit testing purpose only
(2) 'truffle migrate --reset' to migrate contracts into local blockchain (Ganache)
(3) 'truffle test' from the base directory to run the unit tests (all tests should pass except for one, which was designed to fail)
(4) 'comment' out (1) again if migrating contracts for running the Dapp

# Architecture considerations

* The project was initiated by 'truffle init' using the truffle framework.

* The smart contracts are contained in the 'contracts' folder.

* Two contracts are written and combined into one - one being AuctionCollection and Auction
    - As each auction requires a contract of its own, the AuctionCollection contract creates a new contract address and stores the address in a list everytime an auction is created
    - The Auction contract mainly deals with placing bids, transfer of money and the refund of bids

* The logic of how the Dapp works --> (1) A user (i.e. the beneficiary) can create an auction with title, description, starting price and bidding time; (2) After creation, any other user (not the beneficiary) can bid an amount that is higher than the starting price/current highest bid; (3) After expiration of the auction (i.e. passes bidding time), the beneficiary can transfer the higher bid to him/herself; (4) Lastly, all other bidders (i.e. the ones who lost to the highest bid) can have their bids refunded to them.

* For simplicity's sake, currently the web interface only deals with one auction at a time.

* Regarding the Auction contract, security measures have been considered as 'state variables' are always updated/affected before any transfer of value. For example, for bid refunds, the bidder's balance is reduced to 0 before money is being transferred. This complies with the safe 'withdrawal pattern' for smart contracts and prevents malicious attacks such as reentrancy attacks (e.g. the DAO hack) to keep withdrawing money from the smart contract.

* 'Enum states' variables have also been introduced to ensure certain functions can only be called at certain stages. This ensures logical flow of the dapp, e.g. bids can only be placed after the state of 'auction created', and refunds can only been made after auction ends and beneficiary has received money.

* The two auction .js files in the 'contracts' folder are there for the purpose of creating an instance of the smart contracts and ensuring our DAPP can communicate with the instance via the ABI codes.

* The web3.js file allows the user browser to connect to Web3 and MetaMask for interacting with the Dapp.

* The truffle-config.js file is configured so that the smart contracts will be migrated to the local development environment on port 8545. 

* The entire UI of the application and user interaction processes are contained in App.vue, which is then displayed via the body of the div in the index.html file. The template section of the App.vue file contains all the html, the script section contains all the interaction with and logic pertaining to the smart contract functions, and the style section contains some simple CSS styling. Bootstrap CSS has also been used for the Dapp.

* Unit tests are written to ensure all core functions of the Dapp are working.

# Possible future considerations

* With more time, the Dapp can be improved to allow multiple auctions to run at the same time on the user interface.

* A countdown can be introduced to each auction so that all bidders know how much time there is left for each auction.

* A circuit breaker function can be introduced to the smart contracts so that the Dapp creator can stop the Dapp from functioning incase there are malicious attacks on the Dapp (this is for security reasons).

