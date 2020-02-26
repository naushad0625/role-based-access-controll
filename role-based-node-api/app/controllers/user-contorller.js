const User = require("../models/user-model.js");
const consola = require("consola");
const hashEngine = require("../utils/bcrypt.js");
const tokenEngine = require("../utils/jwt.js");
const UserService = require("../services/user-serveic.js");
const UserNotFoundError = require("../errors/user-not-found-error.js");

class UserController {
    constructor() {
        this.login = this.login.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.register = this.register.bind(this);
        this.updateUserById = this.updateUserById.bind(this);

        this.userService = new UserService();
    }

    async register(req, res, next) {
        try {
            const message = await this.userService.register(req.body);
            res.status(201).json({ message });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const accessToken = await this.userService.login(req.body);
            res.status(201).json({ accessToken });
        } catch (error) {
            consola.error(error);
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await this.userService.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const user = req.currentUser;
            console.log(user);

            if (!user) {
                return next(new UserNotFoundError());
            } else {
                const { id, name, email, role } = user;
                res.status(201).json({ id, name, email, role });
            }
        } catch (error) {
            next(error);
        }
    }

    async updateUserById(req, res, next) {
        try {
            const updatedUser = await this.userService.updateUser(
                req.params.user_id,
                req.body,
            );
            res.status(201).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }

    async deleteUserById(req, res, next) {
        try {
            const user_id = req.params.user_id;
            await User.findByIdAndDelete(user_id);
            res.status(201).json("User hsa been deleted.");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = UserController;
