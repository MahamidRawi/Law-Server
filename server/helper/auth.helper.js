const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
require('../DB/models/wallet.model');
const wallet = mongoose.model('walletModel')

const enc = async (pass) => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(pass, saltRounds);
        return hash;
    } catch (err) {
        return {message: "An Error has Occured", err }
    }
}

async function generateUniqueWalletAddress() {
    while (true) {
      let walletAddress = '';
      for (let i = 0; i < 9; i++) {
        walletAddress += Math.floor(Math.random() * 10);
      }
  
      const exists = await wallet.findOne({ walletAddress });
      if (!exists) {
        return walletAddress;
      }
    }
  }
  
module.exports = {enc, generateUniqueWalletAddress}