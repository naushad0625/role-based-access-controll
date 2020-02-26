const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

class TokenEngine {
    constructor() {
        this.getToken = this.getToken.bind(this);
        this.verifyToken = this.verifyToken.bind(this);
    }

    getToken(props) {
        const { ...infos } = props;
        return jwt.sign(infos, jwt_secret, { expiresIn: "1d" });
    }

    verifyToken(jwt_token) {
        try {
            let payload = jwt.verify(jwt_token, jwt_secret);
            return payload;
        } catch (error) {
            return error;
        }
    }
}

module.exports = new TokenEngine();
