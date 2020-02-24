const User = require('../models/user-model.js');

const tokenEngine = require('../utils/jwt.js');
const hashEngine = require('../utils/bcrypt.js');
const userNotFound = require('../errors/user-not-found-error.js');

class UserController {

    constructor() {
        this.register = this.register.bind(this);
    }

    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const hashedPasword = await hashEngine.hashPassword(password);
            const newUser = new User({ name, email, password: hashedPasword, role: role || "user" });
            const accessToken = tokenEngine.getToken({ email, role });

            newUser.accessToken = accessToken;
            await newUser.save();

            res.status(201).json("New user created");

        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) { return next(userNotFound); }

            const validPassword = await hashEngine.validatePassword(password, user.password);
            if (!validPassword) { return new Error('Password is not valid'); }

            const accessToken = tokenEngine.getToken({ _id: user._id });

            await User.findByIdAndUpdate(user._id, { accessToken });
            res.status(200).json({ user: { email: user.email, role: user.role }, accessToken });

        } catch (error) {
            next(error);
        }
    }

    async getUsers(req, res, next) {
        try {
            console.log('Inside GetUsers');

            const rawUsers = await User.find();
            let users = [];

            rawUsers.forEach(ru => {
                let { _id, name, email, role } = ru;
                users.push({ _id, name, email, role });
            });
            console.log(users);
            res.status(200).json(users);

        } catch (error) {
            console.log(error);
            next(error);
        }

    }

    async getUserById(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const user = await User.findById(user_id);
            console.log(user);

            if (!user) {
                res.status(500).json({ message: 'User does not exist' })

            } else {
                const { _id, name, email, role } = user;
                res.status(201).json({ _id, name, email, role });
            }


        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async updateUserById(req, res, next) {
        try {
            const update = req.body;
            const user_id = req.params.user_id;

            await User.findByIdAndUpdate(user_id, update);
            const updated_user = await User.findById(user_id);

            res.status(201).json(updated_user);

        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteUserById(req, res, next) {
        try {
            const user_id = req.params.user_id;
            await User.findByIdAndDelete(user_id);
            res.status(201).json('User hsa been deleted.');

        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = UserController;