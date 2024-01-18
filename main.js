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

app.get("/domain/:query", (req, res) => {
    renderTemplate(res, req, "info.ejs", {
        query: req.params.query,
        queryType: "domain"
    });
})

app.get("/tld/:query", (req, res) => {
    renderTemplate(res, req, "info.ejs", {
        query: req.params.query,
        queryType: "tld"
    });
})

app.get("/ip/:query", (req, res) => {
    renderTemplate(res, req, "info.ejs", {
        query: req.params.query,
        queryType: "ip"
    });
})

app.get("/api/domain/:query", (req, res) => {
    whoiser.domain(req.params.query, { raw: true, })
        .then(data => {
            res.send(data);
            res.status(200);
        })
        .catch(err => {
            if (err) console.log(err);
        })
});

app.listen(process.env.PORT, null, null, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
);