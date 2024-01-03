const { formatDate } = require("../helper/res.helper");

const Err500 = 'An Error Occured';
const transactionMessageSuccess = (senderName, targetName, amount, reason, date) => {
    return `${senderName} has sent ${targetName} ${amount} $ for the following reason : ${reason} on ${formatDate(date)}`
};

module.exports = {Err500, transactionMessageSuccess}
