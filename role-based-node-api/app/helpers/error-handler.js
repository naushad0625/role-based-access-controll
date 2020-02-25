const consola = require("consola");

class ErrorHandler {
    constructor() {
        this.handleError = this.handleError.bind(this);
    }

    async handleError(err, req, res, next) {
        try {
            consola.info("Inside handle error middleware!");
            consola.error(err);

            if (!err.statusCode) {
                return res.status(500).send({ message: err.message });
            }
            res.status(err.statusCode).send({ message: err.message });
        } catch (error) {
            consola.error(error);
            throw error;
        }
    }
}

module.exports = ErrorHandler;
