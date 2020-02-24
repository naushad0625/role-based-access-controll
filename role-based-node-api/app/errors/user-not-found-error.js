class UserNotFoundError extends Error {
    constructor() {
        super();
        this.name = "UserNotFound";
        this.message = "User not found!";
        this.status = 404;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotFoundError);
        }
    }
}

module.exports = new UserNotFoundError();
