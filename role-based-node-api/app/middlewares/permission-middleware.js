const User = require("../models/user-model.js");
const consola = require("consola");
const previlige = require("../../server/roles.js");
const tokenEngine = require("../utils/jwt.js");
const JWTExpiredError = require("../errors/jwt-expired-error.js");

class PermissionManager {
    constructor() {
        this.allowCurrentUser = this.allowCurrentUser.bind(this);
        this.checkAuthentication = this.checkAuthentication.bind(this);
        this.grantPermission = this.grantPermission.bind(this);

        previlige.setAccessController();
        this.accessControler = previlige.getAccessController();
    }

    async allowCurrentUser(req, res, next) {
        try {
            const currentUser = res.locals.currentUser;

            if (!currentUser) {
                consola.info("User authentication failed!");
                return res.status(401).json({
                    message:
                        "User authentication failed! Please login to continue",
                });
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
                consola.info(
                    "Non registered user. Please register to get full access.",
                );
                return next();
            }

            const accessToken = req.headers.authorization.split(" ")[1];
            const payload = tokenEngine.verifyToken(accessToken);

            if (payload.exp < Date.now().valueOf() / 1000) {
                return next(new JWTExpiredError());
            }

            res.locals.currentUser = await User.findOne({
                email: payload.email,
            });
            next();
        } catch (error) {
            next(error);
        }
    }

    grantPermission(action, terget) {
        return async (req, res, next) => {
            try {
                consola.info("inside permissionManager.grantPermission");
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
