pragma solidity >=0.4.22 <0.6.0;

import "./safemath.sol";

// AuctionCollection contract consolidates all created auctions into a list
contract AuctionCollection {

    event AuctionCreated(address beneficiary, string title, uint256 startPrice, string description);

    Auction[] public auctions;

    // A new Auction contract + contract address are created everytime this function is called, all are stored inside a list
    function createAuction(string calldata _title, uint256 _startPrice, string calldata _description, uint256 _biddingTime) external {
        require(_startPrice > 0, "Price too low");
        Auction newAuction = new Auction(msg.sender, _title, _startPrice, _description, _biddingTime);
        auctions.push(newAuction);
        emit AuctionCreated(msg.sender, _title, _startPrice, _description);
    }

    function returnAllAuctions() public view returns(Auction[] memory){
        return auctions;
    }
}

// Auction contract deals with placing auction bids, transfer of money when auction ends and bid refunds
contract Auction {

    // using the SafeMath library to prevent uint underflows and overflows
    using SafeMath for uint256;

    address payable beneficiary;
    string title;
    uint256 startPrice;
    string description;
    uint256 biddingTime;
    uint256 auctionEnd;
    uint256 highestBid;
    address highestBidder;

    enum State {
        AuctionCreated,
        BeneficiaryPaid
    }

    State public state;

    constructor(address payable _beneficiary, string memory _title, uint256 _startPrice, string memory _description, uint256 _biddingTime) public {
        // initializes auction with the variables below
        beneficiary = _beneficiary;
        title = _title;
        startPrice = _startPrice;
        description = _description;
        biddingTime = _biddingTime;
        auctionEnd = now + biddingTime;
        state = State.AuctionCreated;
        highestBid = 0;
    }

    mapping(address => uint256) bidderToAmount;

    // modifier limits the function call by beneficiaries only
    modifier onlyOwner() {
        require(msg.sender == beneficiary, 'You are not the beneficiary');
        _;
    }

    // modifier limits the function call by non-beneficiaries only
    modifier notOwner() {
        require(msg.sender != beneficiary, 'You cannot bid.');
        _;
    }

    // this function deals with bidders placing bids
    function placeBid() external payable notOwner() returns(bool) {
        require(state == State.AuctionCreated, 'Auction not yet created.');
        require(now <= auctionEnd, 'Auction already ended.'); // bid must be placed before auction ends
        require(msg.value > startPrice, 'Bid value must be higher than the starting price');
        uint256 currentBid = bidderToAmount[msg.sender].add(msg.value);
        require(currentBid > highestBid, 'Bid value must be higher.'); // bid must be higher than the current highest bid
        bidderToAmount[msg.sender] = currentBid;
        highestBid = currentBid;
        highestBidder = msg.sender;
        return true;
    }

    function returnAuctionBeneficiary() external view returns (address){
        return(beneficiary);
    }

    function returnHighestBid() external view returns (uint256){
        return(highestBid);
    }

    function returnHighestBidder() external view returns(address){
        return(highestBidder);
    }

    function returnAuctionInfo() external view returns(string memory, uint256, string memory, uint256, State) {
        return(title, startPrice, description, highestBid, state);
    }

    // this function deals with the transfer of money to the beneficiary, only can happen after auction ends
    // only the beneficiary can call this function
    function transferToBene() external payable onlyOwner() {
        require(now > auctionEnd, 'Auction has not yet ended.');
        beneficiary.transfer(highestBid);
        bidderToAmount[highestBidder] = 0;
        state = State.BeneficiaryPaid;
    }

    // this function deals with refunds to bidders, can only be called by bidders after beneficiary is paid
    // change to state variables i.e. bidderToAmount[address] (which is the bid balance) is affected before the transfer of money
    // the above prevents reentrancy attacks and increases contract security
    function returnBid() external payable notOwner() {
        require(state == State.BeneficiaryPaid, 'Funds have not yet been transferred to the beneficiary.');
        require(bidderToAmount[msg.sender] > 0, 'You did not bid.');
        uint256 amount = bidderToAmount[msg.sender];
        bidderToAmount[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}