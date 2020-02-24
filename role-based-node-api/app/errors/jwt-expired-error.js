class JWTExpired extends Error {
    constructor() {
        super();
        this.name = "JWTExpired";
        this.message = "Unauthorized access";
        this.status = 401;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JWTExpired);
        }
    }
}
