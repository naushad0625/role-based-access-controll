const mongoose = require("mongoose");
const Schema = mongoose.Schema;

class UserModel {
    constructor() {
        this.getUserModel = this.getUserModel.bind(this);

        this.userSchema = this.createUserSchema();
    }

    createUserSchema() {
        return new Schema({
            name: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                unique: true,
                required: true,
                trim: true,
            },
            password: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                default: "user",
                enum: ["user", "moderator", "admin"],
            },
        });
    }

    getUserModel() {
        return mongoose.model("user", this.userSchema);
    }
}

module.exports = new UserModel().getUserModel();
