const mongoose = require('mongoose');
const wallet = mongoose.model('walletModel');
const user = mongoose.model('userModel');
const { Err500 } = require('../../vars/vars');

const transferMoney = (senderId, transactionInfo) => {
  return new Promise((resolve, reject) => {
    const { walletAddress, amount, reason } = transactionInfo;
    const date = Date.now();

    Promise.all([
      wallet.findOne({ walletAddress }).exec(),
      wallet.findOne({ owner: senderId }).exec(),
      user.findOne({ _id: senderId }).exec(),
      user.findOne({ walletAddress }).exec(),
      wallet.findOne({ admin: true }).exec(),
    ])
    .then(async ([walletFound, senderWallet, fetchedSenderUser, fetchedTargetUser, fetchedAdminWallet]) => {
      if (!walletFound || !senderWallet || !fetchedSenderUser) {
        throw new Error('No Wallet or User Found');
      }
      if (senderId.toString() === (fetchedTargetUser && fetchedTargetUser._id.toString()) || !reason) {
        throw new Error(!reason ? 'Please Provide a Reason' : 'You cannot send money to yourself!');
      }
      if (senderWallet.balance < amount * 1.02) {
        throw new Error('Insufficient balance to complete this transaction');
      }
      console.log(walletFound.id);

      const adminWalletUpdate = {
        $inc: { balance: amount * 0.02 },
        $push: { income: { sender: senderId, amount: amount * 0.02, reason: 'Transaction Fee', date } }
      };
      const senderWalletUpdate = {
        $inc: { balance: -(amount * 1.02) },
        $push: { expenses: { target: fetchedTargetUser.id, amount:-(amount * 1.02) , reason, date } }
      };
      const recipientWalletUpdate = {
        $inc: { balance: amount },
        $push: { income: { sender: senderId, amount, reason, date } }
      };

      await Promise.all([
            wallet.updateOne({ admin: true }, adminWalletUpdate).exec(),
            wallet.updateOne({ owner: senderId }, senderWalletUpdate).exec(),
            wallet.updateOne({ walletAddress }, recipientWalletUpdate).exec()
        ]);
        return ({
            senderUser: fetchedSenderUser,
            targetUser: fetchedTargetUser,
        });
    })
    .then(({ senderUser, targetUser }) => {
      resolve({
        success: true,
        message: 'Transaction Completed Successfully',
        senderName: senderUser.firstName + ' ' + senderUser.lastName,
        targetMail: targetUser.email,
        targetName: targetUser.firstName + ' ' + targetUser.lastName,
        date,
      });
    })
    .catch((err) => {
      // A more descriptive error message can be constructed based on the error details if needed
      reject({
        success: false,
        message: err.message || Err500,
        stc: 500,
        err,
      });
    });
  });
};

module.exports = { transferMoney };
