const { Schema, model } = require("mongoose");

const userSchema = new Schema({
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
        type: Array,
        default: [{ name: "Nutzer", id: "user", weight: 10, icon: "/img/roleicons/user.png", color: "808080" }],
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
},
{
    timestamps: true,
});

module.exports = model("users", userSchema);