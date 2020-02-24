const consola = require("consola");

class ErrorHandler {
    constructor() {
        this.handleError = this.handleError.bind(this);
    }

    handleError(error) {
        consola.error(error);
        return async (req, res, next) => {
            res.status(error.status).json({ message: error.message });
        };
    }
}

module.exports = ErrorHandler;
