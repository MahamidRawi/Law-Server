const mongoose = require('mongoose');
const wallet = mongoose.model('walletModel');
const user = mongoose.model('userModel');
const { Err500 } = require('../../vars/vars');

const transferMoney = (senderId, transactionInfo) => {
  return new Promise((resolve, reject) => {
    sendMoney(senderId, transactionInfo).then(res => {
        return resolve(res);
  }).catch(err => reject(err));
})
};

const addAdminFee = async (amount, reason, senderId, date) => {
    const fetchedAdmin = await user.findOne({admin: true});
    const requiredAmount = reason === 'Transaction Fee' ? amount * 0.02 : amount
    const adminWalletUpdate = {
        $inc: { balance:  requiredAmount},
        $push: {
          income: {
            $each: [{ sender: senderId, amount: requiredAmount, reason, date }],
            $position: 0, // Insert at the beginning of the array
          },
        },
      };

      const userWalletUpdate = {
        $inc: { balance: -amount },
        $push: {
          expenses: {
            $each: [{ target: fetchedAdmin._id, amount: amount, reason, date }],
            $position: 0, // Insert at the beginning of the array
          },
        },
      };
    await wallet.updateOne({ admin: true }, adminWalletUpdate).exec()
    return await wallet.updateOne({ owner: senderId }, userWalletUpdate).exec()

}

const sendMoney = (senderId, transactionInfo) => {
    return new Promise((resolve, reject) => {
        const { walletAddress, amount, reason } = transactionInfo;
        const date = Date.now();
    
        Promise.all([
          wallet.findOne({ walletAddress }).exec(),
          wallet.findOne({ owner: senderId }).exec(),
          user.findOne({ _id: senderId }).exec(),
          user.findOne({ walletAddress }).exec(),
        ])
        .then(async ([walletFound, senderWallet, fetchedSenderUser, fetchedTargetUser]) => {
            if (!walletFound || !senderWallet || !fetchedSenderUser) throw new Error('No Wallet or User Found')
          if (senderId.toString() === (fetchedTargetUser && fetchedTargetUser._id.toString()) || !reason) throw new Error(!reason ? 'Please Provide a Reason' : 'You cannot send money to yourself!');
          
          if (senderWallet.balance < amount * 1.02) throw new Error('Insufficient balance to complete this transaction');
          addAdminFee(amount, 'Transaction Fee', senderId, date);
          const senderWalletUpdate = {
            $inc: { balance: -(amount * 1.02) },
            $push: {
              expenses: {
                $each: [{ target: fetchedTargetUser.id, amount: amount, reason, date }],
                $position: 0, // Insert at the beginning of the array
              },
            },
          };
          
          const recipientWalletUpdate = {
            $inc: { balance: amount },
            $push: {
              income: {
                $each: [{ sender: senderId, amount, reason, date }],
                $position: 0, // Insert at the beginning of the array
              },
            },
          };
    
          await Promise.all([
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
          reject({
            success: false,
            message: err.message || Err500,
            stc: 500,
            err,
          });
        });
    });
    }

const compareBalanceToRequiredAmount = async (uid, reqAmount) => {
    const fetchedWallet = await wallet.find({owner: uid});
    if (!fetchedWallet || fetchedWallet.balance < reqAmount) return false; else true
} 


module.exports = { transferMoney, addAdminFee, compareBalanceToRequiredAmount };
