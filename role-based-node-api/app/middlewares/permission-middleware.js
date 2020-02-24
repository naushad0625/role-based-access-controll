const User = require("../models/user-model.js");
const previlige = require("../../server/roles.js");
const consola = require("consola");
const tokenEngine = require("../utils/jwt.js");
const JWTExpiredError = require("../errors/jwt-expired-error.js");

class PermissionManager {
    constructor() {
        this.allowCurrentUser = this.allowCurrentUser.bind(this);
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.grantPermission = this.grantPermission.bind(this);

        this.accessControler = previlige.setPreviliges();
    }

    async allowCurrentUser(req, res, next) {
        try {
            const currentUser = res.locals.currentUser;

            if (!currentUser) {
                console.log("No user is logged in");
                return res
                    .status(401)
                    .json({ message: "Please login to continue" });
            }

            req.currentUser = currentUser;
            next();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async checkAuthentication(req, res, next) {
        try {
            if (!req.headers.authorization) {
                console.log("Guest user!. Access controlled.");
                return next();
            }

            const access_token = req.headers.authorization.split(" ")[1];
            const payload = tokenEngine.verifyToken(access_token);

            if (payload.exp < Date.now().valueOf() / 1000) {
                return next(new JWTExpiredError());
            }

            res.locals.currentUser = await User.findById(payload._id);
            next();
        } catch (error) {
            next(error);
        }
    }

    grantPermission(action, terget) {
        return async (req, res, next) => {
            try {
                const permitted = this.accessControler
                    .can(req.currentUser.role)
                    [action](terget);

                if (!permitted) {
                    return res
                        .status(401)
                        .json({ message: "Unauthorized Access!" });
                }

                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        };
    }
}

module.exports = new PermissionManager();
