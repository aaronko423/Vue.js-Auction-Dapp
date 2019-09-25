<template>
  <div class="container">
    <div class="b-row">
      <div>
        <h1>
          Auction
          <span>#{{ amount }}</span>
        </h1>
        <hr>
        <div>
          <label for="title">
            Title
          </label>
          <b-form-input
            id="title"
            v-model="title"
            type="text"
            placeholder="Title"
          />
        </div>
        <div>
          <label for="startPrice">
            Start Price
          </label>
          <b-form-input
            id="startPrice"
            v-model="startPrice"
            type="text"
            placeholder="Starting price in ETH"
          />
        </div>
         <div>
          <label for="biddingTime">
            Bidding Time (Seconds)
          </label>
          <b-form-input
            id="biddingTime"
            v-model="biddingTime"
            type="text"
            placeholder="Bidding time in seconds"
          />
        </div>
      </div>
    </div>
    <div class="b-row">
      <div>
        <label for="Description">
          Description
        </label>
        <br>
        <b-form-textarea
          id="Description"
          v-model="description"
          rows="5"
        />
      </div>
    </div>
    <hr>
    <div class="b-row">
      <div>
        <b-button
          :variant="'primary'"
          @click="createAuction"
        >
          {{ createStatus }}
        </b-button>
        <img
          v-show="isLoad"
          src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"
        >
      </div>
    </div>
    <div v-show="isShow">
      <hr>
      <b-card-group
        columns
        class="mb-3"
      >
        <b-card
          :title="auctionCard[0]"
          :sub-title="'Start Price:' + auctionCard[1] + 'ETH'"
          tag="article"
          style="max-width: 20rem;"
          class="mb-2"
        >
          <hr>
          <p class="card-text, mt-3">
            {{ auctionCardDev[2] }}
          </p>
          <p class="card-text, mt-3">
            Bidders: {{ bidders }}
          </p>
          <p class="card-text, mt-3">
            Highest Bid: {{ highestBid }}
          </p>
          <div>
            <form @submit.prevent="handleSubmit()">
              <b-input-group>
                <b-form-input
                  v-model="bidPrice"
                />
                <b-input-group-append>
                  <button>Place Bid</button>
                  <img
                    v-show="isBid"
                    id="isBid"
                    src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"
                  >
                </b-input-group-append>
              </b-input-group>
            </form>
          </div>
          <b-button
            class="mt-3"
            variant="outline-success"
            @click="handleFinalize()"
          >
            {{ finalizeStatus }}
          </b-button>
          <b-button
            class="mt-3"
            variant="outline-success"
            @click="handleRefund()"
          >
            {{ refundStatus }}
          </b-button>
          <img
            v-show="isFin"
            id="isFin"
            src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"
          >
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import web3 from '../contracts/web3';
import auction from '../contracts/auctionInstance';
import auctionCollection from '../contracts/auctionCollectionInstance';

export default {
  name: 'APP',
  data() {
    return {
      title: '',
      startPrice: '',
      biddingTime: 0,
      description: '',
      amount: 0,
      auctionCard: [],
      auctionCardDev: [],
      isShow: false,
      isLoad: false,
      isBid: false,
      isFin: false,
      bidPrice: '',
      highestBid: 0,
      auctionAddress: '',
      bidders: 0,
      finalizeStatus: 'Finalize auction',
      refundStatus: 'Process refund',
      createStatus: 'CREATE',
    };
  },
  beforeMount() {
    // get auctionCollection method: returnAllAuctions()
    auctionCollection.methods
      .returnAllAuctions()
      .call()
      .then((auctions) => {
        console.log(auctions);
        // set the amount of auctions
        this.amount = auctions.length;

    });
  },
  methods: {
    createAuction() {
      // get accounts
      web3.eth.getAccounts().then((accounts) => {
        // convert 'ether' to 'wei'
        const startPrice = web3.utils.toWei(this.startPrice, 'ether');
        // createAuction in AuctionCollection contract
        this.isLoad = true;
        return auctionCollection.methods.createAuction(this.title, startPrice, this.description, this.biddingTime)
          .send({ from: accounts[0] });
      }).then(() => {
        // initialize forms
        this.isLoad = false;
        this.title = '';
        this.startPrice = '';
        this.biddingTime = '';
        this.description = '';
        // get the previous auction
        return auctionCollection.methods.returnAllAuctions().call();
      }).then((auctions) => {
        const index = auctions.length - 1;
        console.log(auctions[index]);
        // get the contract address of the previous auction
        this.auctionAddress = auctions[index];
        // set the address as the parameter
        const auctionInstance = auction(auctions[index]);
        return auctionInstance.methods.returnAuctionInfo().call();
      })
        .then((lists) => {
          console.log(lists);
          const auctionlists = lists;
          // convert 'wei' to 'ether'
          auctionlists[1] = web3.utils.fromWei(auctionlists[1], 'ether');
          this.auctionCard = auctionlists;
          // show up the auction at the bottom of the page
          this.isShow = true;
          this.amount += 1;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSubmit() {
      // convert 'ether' to 'wei'
      const bidPriceWei = web3.utils.toWei(this.bidPrice, 'ether');
      // get the wallet adddress
      const fromAddress = web3.eth.accounts.givenProvider.selectedAddress;
      // set the address as the parameter
      const selectedAuction = auction(this.auctionAddress);
      this.isBid = true;
      // placeBid in Auction contract
      selectedAuction.methods
        .placeBid()
        .send({
          from: fromAddress,
          value: bidPriceWei,
        })
        .then(() => {
          this.isBid = false;
          // increase the number of bidders
          this.bidders += 1;
          this.bidPrice = '';
          this.highestBid = bidPriceWei/1000000000000000000;
        });
    },
    handleFinalize() {
      // get accounts
      web3.eth.getAccounts().then((accounts) => {
        // set the address as the parameter
        const selectedAuction = auction(this.auctionAddress);
        this.isFin = true;
        // finalizeAuction in Auction contract
        selectedAuction.methods
          .transferToBene()
          .send({ from: accounts[0] })
          .then(() => {
            this.isFin = false;
            this.finalizeStatus = 'finalized';
          });
      });
    },
    handleRefund() {
      // get accounts
      web3.eth.getAccounts().then((accounts) => {
        // set the address as the parameter
        const selectedAuction = auction(this.auctionAddress);
        this.isFin = true;
        // finalizeAuction in Auction contract
        selectedAuction.methods
          .returnBid()
          .send({ from: accounts[0] })
          .then(() => {
            this.isFin = false;
            this.refundStatus = 'refunded';
          });
      });
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

button {
  background-color: #008cba;
  color: white;
}

button:hover {
  background-color: white; /* Green */
  color: #008cba;
  border: #008cba 3px solid;
}

img {
  width: 32px;
}

#isBid, #isFin {
  height: 32px;
  margin-top: 16px;
  margin-left: 8px;
}
</style>
