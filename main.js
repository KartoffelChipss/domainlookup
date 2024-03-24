const ejs = require("ejs");
const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const geoip = require("geoip-lite");
const whoiser = require("whoiser");
const dns = require("node:dns");
const NodeCace = require("node-cache");
const cfpricing = require("./tldpricing/cloudflare.json");
const whoisCache = new NodeCace({ stdTTL: 3600, checkperiod: 120 });
const dnsCache = new NodeCace({ stdTTL: 600, checkperiod: 120 });
const userModal = require("./modals/users");

mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log(console.log("Connected to database")));

const app = express();

const dataDir = path.resolve(`${process.cwd()}${path.sep}`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

app.engine("ejs", ejs.renderFile);
app.set("view engine", "ejs");

const renderTemplate = (res, req, template, data = {}) => {
    const baseData = { path: req.path };
    res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

function getCountryByCode(code) {
    return require("./countrycodes.json").find((country) => country.code === code);
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

const requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/login?redirect=" + req.originalUrl);
    }
};

let authTokens = {};

app.use(async (req, res, next) => {
    const authToken = req.cookies['AuthToken'];

    req.user = authTokens[authToken];

    next();
});

app.use("/assets", express.static(path.resolve(`${dataDir}${path.sep}assets`)));

app.get("/", (req, res) => {
    renderTemplate(res, req, "main.ejs", {
        user: req.user,
    });
});

app.get("/logout", (req, res) => {
    res.clearCookie("AuthToken");

    if (req.query.redirect) {
        res.redirect(req.query.redirect)
    } else {
        res.redirect("/");
    }
    res.end();
});

app.get("/login", (req, res) => {
    renderTemplate(res, req, "login.ejs", {
        loginMessage: 'none',
    });
});

app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    const user = await userModal.findOne({ email: email }) || await userModal.findOne({ userName: email }) || undefined;

    if (!user) {
        renderTemplate(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültige E-Mail-Adresse oder Benutzername!',
        });
        return;
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
        renderTemplate(res, req, "login.ejs", {
            user: req.user,
            alertMessage: 'Ungültiges Passwort!',
        });
        return;
    }

    const authToken = generateAuthToken();
    authTokens[authToken] = user;

    res.cookie("AuthToken", authToken, { maxAge: 31536000, secure: true, httpOnly: true });

    if (req.query.redirect) res.redirect(req.query.redirect);
    else res.redirect("/");
});

app.get("/domain/:query", (req, res) => {
    renderTemplate(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "domain",
    });
});

app.get("/tld/:query", (req, res) => {
    renderTemplate(res, req, "info.ejs", {
        user: req.user,
        query: req.params.query,
        queryType: "tld",
    });
});

function formatPrice(price) {
    var formattedPrice = parseFloat(price).toFixed(2);
    return "$" + formattedPrice;
}

function getWhoisData(domain) {
    const domainSplit = domain.split(".");
    return new Promise((resolve, reject) => {
        whoiser
            .domain(domain, { raw: true })
            .then((data) => {
                let cfPrice = cfpricing.find((tld) => tld.tld_name === domainSplit[domainSplit.length - 1])?.registration_price_usd;
                if (cfPrice) data.cfPrice = formatPrice(cfPrice);
                resolve(data);
            })
            .catch((err) => {
                if (err) {
                    reject(err);
                }
            });
    });
}

app.get("/api/domain/:query", (req, res) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(domain);

    if (cachedResult && !forceReload) {
        //console.log('Result for %s found in cache', domain);
        return res.send(cachedResult).status(200);
    }

    getWhoisData(domain)
        .then((data) => {
            res.send(data);
            res.status(200);
            whoisCache.set(domain, {
                ...data,
                cachedAt: new Date().getTime(),
            });
        })
        .catch((err) => {
            if (err) {
                res.send(err);
                res.status(500);
            }
        });
});

function checkAvailability(whoisResult) {
    let whoisData = {};
    for (let servername in whoisResult) {
        for (let label in whoisResult[servername]) {
            whoisData[label] = whoisResult[servername][label];
        }
    }

    return ((whoisData["Domain Status"] && whoisData["Domain Status"].includes("free")) || !whoisData["Name Server"] || (whoisData["Name Server"] && whoisData["Name Server"].length <= 0)) && whoisData.__raw && !whoisData.__raw.includes("Too many queries from your IP");
}

app.get("/api/checkAvailability/:query", (req, res) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cacheOnly = req.query.cacheOnly === "true";
    const cachedResult = whoisCache.get(domain);

    if (cachedResult && !forceReload) {
        return res.send({ status: "OK", available: checkAvailability(cachedResult), cachedAt: cachedResult.cachedAt }).status(200);
    }

    if (cacheOnly) return res.send({ status: "ERROR", error: "No cached result found" }).status(500);

    getWhoisData(domain)
        .then((data) => {
            whoisCache.set(domain, {
                ...data,
                cachedAt: new Date().getTime(),
            });
            res.send({ status: "OK", available: checkAvailability(data) }).status(200);
        })
        .catch((err) => {
            if (err) {
                res.send({ status: "ERROR", error: err }).status(500);
            }
        });
});

app.get("/api/tld/:query", (req, res) => {
    const tld = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(tld);

    if (cachedResult && !forceReload) {
        return res.send(cachedResult).status(200);
    }

    whoiser
        .tld(tld, { raw: true })
        .then((data) => {
            res.send(data);
            res.status(200);
            whoisCache.set(tld, {
                ...data,
                cachedAt: new Date().getTime(),
            });
        })
        .catch((err) => {
            if (err) {
                res.send(err);
                res.status(500);
            }
        });
});

app.get("/api/dns/:hostname", (req, res) => {
    const hostname = req.params.hostname;
    const forceReload = req.query.forceReload === "true";
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
                for (ip in ret) {
                    ret[ip] = {
                        ip: ret[ip],
                        geo: geoip.lookup(ret[ip]),
                    };

                    ret[ip].geo.countryName = getCountryByCode(ret[ip].geo.country)?.name;
                }
                resolve(ret);
            }
        });
    });

    let AAAApromise = new Promise((resolve, reject) => {
        dns.resolve6(hostname, (err, ret) => {
            if (err) {
                resolve([]);
            } else {
                for (ip in ret) {
                    ret[ip] = {
                        ip: ret[ip],
                        geo: geoip.lookup(ret[ip]),
                    };

                    ret[ip].geo.countryName = getCountryByCode(ret[ip].geo.country)?.name;
                }
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

app.listen(process.env.PORT, null, null, () => console.log(`Server is running on port ${process.env.PORT}`));
