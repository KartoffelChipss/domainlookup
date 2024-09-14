"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema using TypeScript
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
    },
    email: {
        type: String,
        default: "none",
    },
    emailVerification: {
        type: String,
        default: "none",
    },
    password: {
        type: String,
    },
    userName: {
        type: String,
    },
    avatar: {
        type: String,
        default: "/avatars/defaults/default01.png",
    },
    type: {
        type: String,
        default: "private",
    },
    roles: {
        type: [
            {
                name: { type: String, required: true },
                id: { type: String, required: true },
                weight: { type: Number, required: true },
                icon: { type: String, required: true },
                color: { type: String, required: true },
            }
        ],
        default: [
            { name: "Nutzer", id: "user", weight: 10, icon: "/img/roleicons/user.png", color: "808080" }
        ],
    },
    warnings: {
        type: Number,
        default: 0,
    },
    locked: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    pwdresettoken: {
        type: String,
        default: "none",
    },
    securityMails: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});
// Create and export the Mongoose model
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
