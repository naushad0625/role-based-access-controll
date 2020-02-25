require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const consola = require("consola");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const RootRouter = require("./routes/route.js");
const mongoDbUrl = process.env.MONGO_URL;
const ErrorHandler = require("./helpers/error-handler.js");

class App {
    constructor() {
        this.app = express();
        this.rootRouter = new RootRouter();
        this.errorHandler = new ErrorHandler();

        //binding methods to object
        this.getApp = this.getApp.bind(this);
        this.configure = this.configure.bind(this);
    }

    async configure() {
        try {
            this.app.use(cors());
            this.app.use(helmet());
            this.app.use(morgan("combined"));
            this.app.use(bodyParser.json());
            this.app.use(bodyParser.urlencoded({ extended: true }));

            await mongoose.connect(mongoDbUrl, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });

            consola.success({
                message: "Successfully connected to database.",
                badge: true,
            });
            await this.rootRouter.configureRoutes();

            //Handling all routes
            this.app.use("/", this.rootRouter.getRouter());

            //Handling errors
            this.app.use((err, req, res, next) => {
                this.errorHandler.handleError(err, req, res, next);
            });
        } catch (error) {
            consola.error(error);
            throw error;
        }
    }

    getApp() {
        return this.app;
    }
}

module.exports = App;
