const bcrypt = require('bcrypt');
const saltRounds = 10;

class HashEngine {
    constructor() {
        this.hashPassword = this.hashPassword.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, saltRounds);
    }

    async validatePassword(plain_password, hashed_password) {
        console.log(plain_password);
        console.log(hashed_password);
        return await bcrypt.compare(plain_password, hashed_password);
    }
}

module.exports = new HashEngine();