const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const whoiser = require('whoiser')
const dns = require("node:dns");

const app = express();

const dataDir = path.resolve(`${process.cwd()}${path.sep}`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

const renderTemplate = (res, req, template, data = {}) => {
    const baseData = { path: req.path, };
    res.render(
        path.resolve(`${templateDir}${path.sep}${template}`),
        Object.assign(baseData, data),
    );
};

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use("/assets", express.static(path.resolve(`${dataDir}${path.sep}assets`)));

app.get("/", (req, res) => {
    renderTemplate(res, req, "main.ejs", {});
})

app.get("/domain/:domain", (req, res) => {
    renderTemplate(res, req, "main.ejs", {});
})

app.get("/tld/:tld", (req, res) => {
    renderTemplate(res, req, "main.ejs", {});
})

app.get("/ip/:ip", (req, res) => {
    renderTemplate(res, req, "main.ejs", {});
})

app.listen(process.env.PORT, null, null, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
);