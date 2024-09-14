import ejs from 'ejs';
import path from 'path';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import {AuthManager, requireAuth} from "./util/auth";

import apiRouter from './routes/api';
import authRouter from './routes/auth';

mongoose.connect(process.env.MONGO_URI || '', {}).then(() => console.log("Connected to database"));

const app = express();

export const authManager = new AuthManager();

const dataDir = path.resolve(`${process.cwd()}${path.sep}src`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);
const utilDir = path.resolve(path.join(dataDir, "util"));

app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

export const renderTemplate = (res: Response, req: Request, template: string, data: object = {}) => {
    const baseData = { path: req.path };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), { ...baseData, ...data });
};

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

export function getCountryByCode(code: string): { code: string; name: string } | undefined {
    return require(path.join(utilDir, "countrycodes.json")).find((country: { code: string; name: string }) => country.code === code);
}

app.use(authManager.use);

app.use("/api", apiRouter);
app.use("/", authRouter);

app.use("/assets", express.static(path.resolve(`${dataDir}${path.sep}assets`)));

app.get("/", requireAuth, (req: Request, res: Response) => {
    renderTemplate(res, req, "main.ejs", {
        user: req.user,
    });
});

app.get("/domain/:query", requireAuth, (req: Request, res: Response) => {
    renderTemplate(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "domain",
    });
});

app.get("/tld/:query", requireAuth, (req: Request, res: Response) => {
    renderTemplate(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "tld",
    });
});

app.listen(process.env.PORT || 3000, () => console.log(`Server is running on port ${process.env.PORT || 3000}`));