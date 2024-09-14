import {IUser} from "../modals/users";
import crypto from "crypto";
import {NextFunction, Request, Response} from "express";

export interface AuthTokens {
    [key: string]: IUser;
}

const generateAuthToken = (): string => {
    return crypto.randomBytes(30).toString('hex');
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/login?redirect=" + req.originalUrl);
    }
};

export class AuthManager {
    authTokens: AuthTokens = {};

    constructor() {
        this.authTokens = {};
    }

    public use = async (req: Request, res: Response, next: NextFunction) => {
        const authToken = req.cookies['AuthToken'];

        if (authToken) {
            req.user = this.authTokens[authToken];
        }

        next();
    }

    public login = async (res: Response, user: IUser) => {
        const authToken = generateAuthToken();
        this.authTokens[authToken] = user;
        res.cookie("AuthToken", authToken, { maxAge: 31536000, secure: true, httpOnly: true });
    }
}