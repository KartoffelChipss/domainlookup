const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const whoiser = require('whoiser')
const dns = require("node:dns");
const NodeCace = require("node-cache");
const whoisCache = new NodeCace({ stdTTL: 3600, checkperiod: 120, });
const dnsCache = new NodeCace({ stdTTL: 600, checkperiod: 120, });

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

app.get("/api/domain/:query", (req, res) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === 'true';
    const cachedResult = whoisCache.get(domain);

    if (cachedResult && !forceReload) {
        //console.log('Result for %s found in cache', domain);
        return res.send(cachedResult).status(200);
    }

    whoiser.domain(domain, { raw: true, })
        .then(data => {
            res.send(data);
            res.status(200);
            whoisCache.set(domain, {
                ...data,
                cachedAt: new Date().getTime(),
            });
        })
        .catch(err => {
            if (err) {
                res.send(err);
                res.status(500);
            }
        })
});

app.get("/api/tld/:query", (req, res) => {
    const tld = req.params.query;
    const forceReload = req.query.forceReload === 'true';
    const cachedResult = whoisCache.get(tld);

    if (cachedResult && !forceReload) {
        //console.log('Result for %s found in cache', tld);
        return res.send(cachedResult).status(200);
    }

    whoiser.tld(tld, { raw: true, })
        .then(data => {
            res.send(data);
            res.status(200);
            whoisCache.set(tld, {
                ...data,
                cachedAt: new Date().getTime(),
            });
        })
        .catch(err => {
            if (err) {
                res.send(err);
                res.status(500);
            }
        })
});

app.get("/api/dns/:hostname", (req, res) => {
    const hostname = req.params.hostname;
    const forceReload = req.query.forceReload === 'true';
    const cachedResult = dnsCache.get(hostname);

    if (cachedResult && !forceReload) {
        // console.log('Result for %s found in cache', hostname);
        return res.send(cachedResult).status(200);
    }

    let Apromise = new Promise((resolve, reject) => {
        dns.resolve4(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let AAAApromise = new Promise((resolve, reject) => {
        dns.resolve6(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let MXpromise = new Promise((resolve, reject) => {
        dns.resolveMx(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let NSpromise = new Promise((resolve, reject) => {
        dns.resolveNs(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let CNAMEpromise = new Promise((resolve, reject) => {
        dns.resolveCname(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let SRVpromise = new Promise((resolve, reject) => {
        dns.resolveSrv(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    let TXTpromise = new Promise((resolve, reject) => {
        dns.resolveTxt(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                resolve(ret);
            }
        });
    });

    Promise.all([Apromise, AAAApromise, MXpromise, CNAMEpromise, SRVpromise, TXTpromise, NSpromise]).then((values) => {
        let ret = {
            A: values[0],
            AAAA: values[1],
            MX: values[2],
            CNAME: values[3],
            SRV: values[4],
            TXT: values[5],
            NS: values[6],
        };
        res.send(ret).status(200);
        dnsCache.set(hostname, {
            ...ret,
            cachedAt: new Date().getTime(),
        });
    });
});

app.listen(process.env.PORT, null, null, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
);