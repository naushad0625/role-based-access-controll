const mongoDbUrl = process.env.MONGO_URL;

class MongoDbConfigurator {

    constructor() {
        this.mongoose = require('mongoose');

        try {
            this.mongoose.connect(mongoDbUrl, { useNewUrlParser: true });
        } catch (error) {
            console.log(error);
        }
    }

    getMongoose() {
        return this.mongoose;
    }
}

module.exports = new MongoDbConfigurator();
