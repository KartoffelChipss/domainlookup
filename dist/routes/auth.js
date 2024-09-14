"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../modals/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const main_1 = require("../main");
const router = (0, express_1.Router)();
router.get("/logout", (req, res) => {
    res.clearCookie("AuthToken");
    if (req.query.redirect) {
        res.redirect(req.query.redirect);
    }
    else {
        res.redirect("/");
    }
    res.end();
});
router.get("/login", (req, res) => {
    (0, main_1.renderTemplate)(res, req, "login.ejs", {
        loginMessage: 'none',
    });
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.username;
    const password = req.body.password;
    const user = (yield users_1.default.findOne({ email: email })) || (yield users_1.default.findOne({ userName: email })) || undefined;
    if (!user) {
        (0, main_1.renderTemplate)(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültige E-Mail-Adresse oder Benutzername!',
        });
        return;
    }
    if (!user.password) {
        (0, main_1.renderTemplate)(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültiges Passwort!',
        });
        return;
    }
    const passwordIsValid = bcrypt_1.default.compareSync(password, user.password);
    if (!passwordIsValid) {
        (0, main_1.renderTemplate)(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültiges Passwort!',
        });
        return;
    }
    main_1.authManager.login(res, user);
    if (req.query.redirect)
        res.redirect(req.query.redirect);
    else
        res.redirect("/");
}));
exports.default = router;
