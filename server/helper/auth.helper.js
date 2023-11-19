const bcrypt = require("bcryptjs");

const enc = async (pass) => {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(pass, saltRounds);
        console.log(hash);
        return hash;
    } catch (err) {
        return {message: "An Error has Occured", err }
    }
}

module.exports = enc