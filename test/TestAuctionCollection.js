const AuctionCollection = artifacts.require("AuctionCollection");
const Auction = artifacts.require("Auction");

contract('AuctionCollection', accounts => {
    // Assigning addresses to contract deployer and different users for testing purposes
    const beneficiary = accounts[0];
    const userOne = accounts[1];
    const userTwo = accounts[2];

    // Tests whether a new auction contract is created
    it('new auction contract should be created', async () => {
      const contract = await AuctionCollection.deployed();
      await contract.createAuction("US Open", 1, "Front Row Seats", 120, {from: beneficiary});
      const auctionList = await contract.returnAllAuctions();
      assert.equal(auctionList.length, 1);
    });

    // Tests whether someone can successfully bid
    it('the ETH balance of the bidder goes down after bidding', async () => {
      const oldBalance = await web3.eth.getBalance(userOne);
      const contract = await Auction.deployed();
      await contract.placeBid({ 
        from: userOne,  
        value: Number(web3.utils.toWei("3"))
      });
      const newBalance = await web3.eth.getBalance(userOne);
      assert.isAbove(Number(oldBalance), Number(newBalance));
    });

      // Tests if someone other than the beneficiary can call the transfer bids (money) function
      // This test should fail and show "revert You are not the beneficiary"
    it('the ETH balance of the bidder goes down after bidding', async () => {
      const contract = await Auction.deployed();
      await contract.transferToBene({ 
        from: userTwo,
      });
    });

  });