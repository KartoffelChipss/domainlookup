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
exports.lookupDnsData = lookupDnsData;
exports.lookupNSRecords = lookupNSRecords;
const node_dns_1 = __importDefault(require("node:dns"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const main_1 = require("../../main");
function lookupDnsData(hostname) {
    return __awaiter(this, void 0, void 0, function* () {
        const [A, AAAA, MX, NS, CNAME, TXT] = yield Promise.all([
            lookupARecords(hostname),
            lookupAAAARecords(hostname),
            lookupMXRecords(hostname),
            lookupNSRecords(hostname),
            lookupCNAME(hostname),
            lookupTXT(hostname),
        ]);
        return {
            A,
            AAAA,
            MX,
            NS,
            CNAME,
            TXT,
        };
    });
}
function lookupARecords(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolve4(hostname, (err, ret) => {
            var _a;
            if (err) {
                resolve([]);
                return;
            }
            const records = [];
            for (const ip of ret) {
                const geo = geoip_lite_1.default.lookup(ip);
                const countryName = (geo ? (_a = (0, main_1.getCountryByCode)(geo.country)) === null || _a === void 0 ? void 0 : _a.name : "Unknown") || "Unknown";
                records.push({
                    ip,
                    geo: geo,
                    countryName: countryName,
                });
            }
            return resolve(records);
        });
    });
}
function lookupAAAARecords(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolve6(hostname, (err, ret) => {
            var _a;
            if (err) {
                resolve([]);
                return;
            }
            const records = [];
            for (const ip of ret) {
                const geo = geoip_lite_1.default.lookup(ip);
                const countryName = (geo ? (_a = (0, main_1.getCountryByCode)(geo.country)) === null || _a === void 0 ? void 0 : _a.name : "Unknown") || "Unknown";
                records.push({
                    ip,
                    geo: geo,
                    countryName: countryName,
                });
            }
            return resolve(records);
        });
    });
}
function lookupMXRecords(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolveMx(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }
            const records = [];
            for (const record of ret) {
                records.push({
                    priority: record.priority,
                    exchange: record.exchange,
                });
            }
            return resolve(records);
        });
    });
}
function lookupNSRecords(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolveNs(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }
            return resolve(ret);
        });
    });
}
function lookupCNAME(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolveCname(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }
            return resolve(ret);
        });
    });
}
function lookupTXT(hostname) {
    return new Promise((resolve, reject) => {
        node_dns_1.default.resolveTxt(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }
            return resolve(ret.map((txt) => txt.join(" ")));
        });
    });
}
