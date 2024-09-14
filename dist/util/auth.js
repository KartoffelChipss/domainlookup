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
exports.AuthManager = exports.requireAuth = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateAuthToken = () => {
    return crypto_1.default.randomBytes(30).toString('hex');
};
const requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/login?redirect=" + req.originalUrl);
    }
};
exports.requireAuth = requireAuth;
class AuthManager {
    constructor() {
        this.authTokens = {};
        this.use = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authToken = req.cookies['AuthToken'];
            if (authToken) {
                req.user = this.authTokens[authToken];
            }
            next();
        });
        this.login = (res, user) => __awaiter(this, void 0, void 0, function* () {
            const authToken = generateAuthToken();
            this.authTokens[authToken] = user;
            res.cookie("AuthToken", authToken, { maxAge: 31536000, secure: true, httpOnly: true });
        });
        this.authTokens = {};
    }
}
exports.AuthManager = AuthManager;
