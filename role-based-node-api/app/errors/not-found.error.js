class NoRouteFoundError extends Error {
    constructor() {
        super();
        this.name = "NoRouteFoundError";
        this.message = "No route found!";
        this.statusCode = 404;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoRouteFoundError);
        }
    }
}

module.exports = new NoRouteFoundError();
