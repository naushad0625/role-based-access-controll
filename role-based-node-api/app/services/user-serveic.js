const User = require("../models/user-model.js");
const consola = require("consola");
const hashEngine = require("../utils/bcrypt.js");
const tokenEngine = require("../utils/jwt.js");
const UserNotFoundError = require("../errors/user-not-found-error.js");

class UserService {
    constructor() {}

    async register({ name, email, password, role }) {
        try {
            if (!role) {
                role = "user";
            }
            password = await hashEngine.hashPassword(password);
            const newUser = new User({ name, email, password, role });
            await newUser.save();
            return "New user created.";
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                throw new UserNotFoundError();
            }

            const validPassword = await hashEngine.validatePassword(
                password,
                user.password,
            );
            if (!validPassword) {
                throw new Error("Invalid Password.");
            }

            const accessToken = tokenEngine.getToken({
                name: user.name,
                email: user.email,
                role: user.role,
            });

            return accessToken;
        } catch (error) {
            throw error;
        }
    }

    async findAll() {
        try {
            consola.info("Inside UserService.findAll");

            const rawUsers = await User.find();
            let users = [];

            rawUsers.forEach(ru => {
                let { _id, name, email, role } = ru;
                users.push({ _id, name, email, role });
            });
            return users;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(filter, update) {
        try {
            const updatedUser = await User.findOneAndUpdate(filter, update);
            const { _id, name, email, role } = updatedUser;
            return { _id, name, email, role };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
