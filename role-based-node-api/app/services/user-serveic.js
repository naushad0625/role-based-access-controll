
const User = require('../models/user-model.js');


class UserService {
    constructor() {
        this.addNew = this.addNew.bind(this);
    }

    async addNew({ email, password, role }) {

        let token = null;
        let error = false;



    }
}

module.exports = UserService;