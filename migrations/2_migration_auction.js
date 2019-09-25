const AuctionCollection = artifacts.require("AuctionCollection");
//const Auction = artifacts.require("Auction");

module.exports = function (deployer) {
  deployer.deploy(AuctionCollection);
  //deployer.deploy(Auction, "0x0000000000000000000000000000000000000000", "", 0, "", 1000000000);
};

//Please uncomment the above when doing migration for unit testing