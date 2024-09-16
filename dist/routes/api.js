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
const node_cache_1 = __importDefault(require("node-cache"));
const auth_1 = require("../util/auth");
const whois_1 = require("../util/whois");
const dns_1 = require("../util/dns");
const dns_2 = require("../util/dns");
const whoisCache = new node_cache_1.default({ stdTTL: 3600, checkperiod: 120 });
const dnsCache = new node_cache_1.default({ stdTTL: 600, checkperiod: 120 });
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    res.send('Welcome to the PluginZ api!');
});
router.get("/domain/:query", auth_1.requireAuth, (req, res) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(domain);
    if (cachedResult && !forceReload) {
        //console.log('Result for %s found in cache', domain);
        return res.send(cachedResult).status(200);
    }
    (0, whois_1.getDomainWhoisData)(domain)
        .then((data) => {
        res.send(data);
        res.status(200);
        data.cachedAt = new Date().getTime();
        whoisCache.set(domain, data);
    })
        .catch((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                message: "An error occurred while checking whois data",
                error: "Internal Server Error",
                statusCode: 500
            });
        }
    });
});
router.get("/checkAvailability/:query", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cacheOnly = req.query.cacheOnly === "true";
    const cachedResult = dnsCache.get(domain);
    if (cachedResult && !forceReload) {
        return res.send({ status: "OK", available: ((_a = cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.NS) === null || _a === void 0 ? void 0 : _a.length) <= 0, cachedAt: cachedResult === null || cachedResult === void 0 ? void 0 : cachedResult.cachedAt }).status(200);
    }
    if (cacheOnly)
        return res.send({ status: "ERROR", error: "No cached result found" }).status(500);
    (0, dns_1.lookupNSRecords)(domain)
        .then((data) => {
        res.send({ status: "OK", available: data.length <= 0 }).status(200);
    })
        .catch((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                message: "An error occurred while checking domain availability",
                error: "Internal Server Error",
                statusCode: 500
            });
        }
    });
}));
router.get("/tld/:query", auth_1.requireAuth, (req, res) => {
    const tld = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(tld);
    if (cachedResult && !forceReload) {
        return res.status(200).send(cachedResult);
    }
    (0, whois_1.getTldWhoisData)(tld)
        .then((data) => {
        res.send(data);
        res.status(200);
        whoisCache.set(tld, Object.assign(Object.assign({}, data), { cachedAt: new Date().getTime() }));
    })
        .catch((err) => {
        if (err) {
            console.error(err);
            res.status(500).send({
                message: "An error occurred while checking whois data",
                error: "Internal Server Error",
                statusCode: 500
            });
        }
    });
});
router.get("/dns/:hostname", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hostname = req.params.hostname;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = dnsCache.get(hostname);
    if (cachedResult && !forceReload) {
        // console.log('Result for %s found in cache', hostname);
        return res.status(200).send(cachedResult);
    }
    const dnsData = yield (0, dns_2.lookupDnsData)(hostname);
    res.status(200).send(dnsData);
    dnsCache.set(hostname, Object.assign(Object.assign({}, dnsData), { cachedAt: new Date().getTime() }));
}));
router.get("*", (req, res) => {
    res.status(404).send({
        message: "Cannot GET " + req.path,
        error: "Not Found",
        statusCode: 404
    });
});
exports.default = router;
