require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const consola = require('consola');

const RootRouter = require('./routes/route.js');
const mongoDbUrl = process.env.MONGO_URL;

class App {
    constructor() {
        this.getApp = this.getApp.bind(this);


        this.rootRouter = new RootRouter();
        this.app = express();
        this.configure();
    }

    /**
     *
     */
    async configure() {

        try {
            this.app.use(cors());
            this.app.use(helmet());
            this.app.use(morgan('combined'));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));

            await mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
            consola.success({
                message: 'Successfully connected to database.',
                badge: true
            })

            this.app.use('/', this.rootRouter.getRouter());

        } catch (err) {
            consola.error({
                message: err,
                badge: true
            })
        }

    }

    getApp() {
        return this.app;
    }
}

module.exports = App;