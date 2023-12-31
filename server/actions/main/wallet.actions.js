require('../../DB/models/wallet.model');
require('../../DB/models/user.model');
const mongoose = require('mongoose');
const wallet = mongoose.model('walletModel');
const user = mongoose.model('userModel');
const { getUser } = require('./fetch.actions');
const { Err500 } = require('../../vars/vars');


const transferMoney = (senderId, transactionInfo) => {
    return new Promise(async (resolve, reject) => {
        const {walletAddress, amount, reason} = transactionInfo
        const date = Date.now();
        const walletFound = await wallet.findOne({walletAddress});
        const senderWallet = await wallet.findOne({owner: senderId});
        const senderUser = await user.findOne({_id: senderId});
        console.log('sender USER', senderUser)
        const targetUser = await user.findOne({walletAddress});
        console.log('target USER', targetUser);
        const adminWallet = await wallet.findOne({admin: true});
        try {

            if (!walletFound || !senderWallet || !senderUser) return reject({success: false, message: !senderUser ? 'No Wallet Found' : 'No User Found', stc: !senderWallet ? 401 : 404});
            if (senderWallet.balance < amount*1.02) return reject({success: false, message: 'You don\'t Have the sufficient balance to complete this transaction !', stc: 400});
            adminWallet.income.unshift({
                sender: senderId,
                amount: amount * 0.02,
                reason: 'Transaction Fee',
                date
            });
            adminWallet.balance += amount * 0.02;
            await adminWallet.save();
            walletFound.expenses.unshift({
                target: walletFound._id,
                amount,
                reason,
                date,
            });
            walletFound.balance += amount
            await walletFound.save();

            
            senderWallet.balance -= amount * 1.02
            await senderWallet.save();
            console.log(targetUser)
            return resolve({success: true, message: 'Transaction Completed Successfully', senderName: senderUser.firstName + ' ' + senderUser.lastName, targetMail: targetUser.email, targetName: targetUser.firstName + ' ' + targetUser.lastName, date});
    } catch (err) {
        try {
            walletFound.income.shift();
            senderWallet.expenses.shift();
            adminWallet.balance -= amount * 0.02
            walletFound.balance -= amount
            senderWallet.balance += amount * 1.02
            await walletFound.save();
            await senderWallet.save();
            await adminWallet.save();
            console.log('ERR: ', err)
            return reject({success: false, message: Err500, stc: 500, err});
    } catch (err) {
        console.log(err);
            return reject({success: false, message: Err500, stc: 500, err});
    }
    };
});
}

module.exports = {transferMoney}