"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatWhoisData = formatWhoisData;
exports.formatTldWhoisData = formatTldWhoisData;
/**
 * Formats the whois data into a more usable format
 * @param whoisData The raw whois data
 */
function formatWhoisData(whoisData, cfPrice = null) {
    var _a, _b;
    let data = {};
    for (let servername in whoisData) {
        for (let label in whoisData[servername]) {
            data[label] = whoisData[servername][label];
        }
    }
    const resultData = {};
    if (data["Domain Name"])
        resultData.domain = data["Domain Name"];
    if (data["Registrar"])
        resultData.registrar = data["Registrar"];
    if (data["Created Date"])
        resultData.creationDate = data["Created Date"];
    if (data["Expiry Date"])
        resultData.expiryDate = data["Expiry Date"];
    if (data["Updated Date"])
        resultData.updatedDate = data["Updated Date"];
    resultData.status = [];
    if (data["Domain Status"] && Array.isArray(data["Domain Status"])) {
        for (let status of data["Domain Status"]) {
            resultData.status.push(((_a = status.split(" ")[0]) !== null && _a !== void 0 ? _a : status).trim());
        }
    }
    resultData.nameServers = [];
    if (data["Name Server"] && Array.isArray(data["Name Server"])) {
        for (let ns of data["Name Server"]) {
            resultData.nameServers.push(((_b = ns.split(" ")[0]) !== null && _b !== void 0 ? _b : ns).trim());
        }
    }
    resultData.hasRegistrantInfo = !!(data["Registrant Name"] || data["Registrant Organization"] || data["Registrant Street"] || data["Registrant City"] || data["Registrant State/Province"] || data["Registrant Postal Code"] || data["Registrant Country"] || data["Registrant Phone"] || data["Registrant Fax"] || (data["Registrant Email"] && data["Registrant Email"].includes("@")));
    if (resultData.hasRegistrantInfo)
        resultData.registrantInfo = getWhoisContactInfo(data, "Registrant");
    resultData.hasAdminInfo = !!(data["Admin Name"] || data["Admin Organization"] || data["Admin Street"] || data["Admin City"] || data["Admin State/Province"] || data["Admin Postal Code"] || data["Admin Country"] || data["Admin Phone"] || data["Admin Fax"] || (data["Admin Email"] && data["Admin Email"].includes("@")));
    if (resultData.hasAdminInfo)
        resultData.adminInfo = getWhoisContactInfo(data, "Admin");
    resultData.hasTechInfo = !!(data["Tech Name"] || data["Tech Organization"] || data["Tech Street"] || data["Tech City"] || data["Tech State/Province"] || data["Tech Postal Code"] || data["Tech Country"] || data["Tech Phone"] || data["Tech Fax"] || (data["Tech Email"] && data["Tech Email"].includes("@")));
    if (resultData.hasTechInfo)
        resultData.techInfo = getWhoisContactInfo(data, "Tech");
    if (data.__raw)
        resultData.raw = data.__raw;
    if (cfPrice)
        resultData.cfPrice = cfPrice;
    return resultData;
}
function getWhoisContactInfo(data, type) {
    const contactInfo = {};
    if (data[`${type} Name`])
        contactInfo.name = data[`${type} Name`];
    if (data[`${type} Organization`])
        contactInfo.organization = data[`${type} Organization`];
    if (data[`${type} Street`])
        contactInfo.street = data[`${type} Street`];
    if (data[`${type} City`])
        contactInfo.city = data[`${type} City`];
    if (data[`${type} State/Province`])
        contactInfo.state = data[`${type} State/Province`];
    if (data[`${type} Postal Code`])
        contactInfo.postalCode = data[`${type} Postal Code`];
    if (data[`${type} Country`])
        contactInfo.country = data[`${type} Country`];
    if (data[`${type} Phone`])
        contactInfo.phone = data[`${type} Phone`];
    if (data[`${type} Fax`])
        contactInfo.fax = data[`${type} Fax`];
    if (data[`${type} Email`])
        contactInfo.email = data[`${type} Email`];
    return contactInfo;
}
/**
 * Formats the TLD whois data into a more usable format
 * @param data The raw whois data
 */
function formatTldWhoisData(data) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    const resultData = {};
    if (data["domain"])
        resultData.domain = data["domain"];
    if (data["created"])
        resultData.created = data["created"];
    if (data["changed"])
        resultData.changed = data["changed"];
    if ((_a = data.organisation) === null || _a === void 0 ? void 0 : _a.organisation)
        resultData.organization = (_b = data.organisation) === null || _b === void 0 ? void 0 : _b.organisation;
    if (data["status"])
        resultData.status = data["status"];
    if (data["whois"])
        resultData.whoisServer = data["whois"];
    resultData.hasAdminInfo = !!(((_d = (_c = data.contacts) === null || _c === void 0 ? void 0 : _c.administrative) === null || _d === void 0 ? void 0 : _d.address) || ((_f = (_e = data.contacts) === null || _e === void 0 ? void 0 : _e.administrative) === null || _f === void 0 ? void 0 : _f.contact) || ((_g = data.contacts) === null || _g === void 0 ? void 0 : _g.administrative["e-mail"]) || ((_h = data.contacts) === null || _h === void 0 ? void 0 : _h.administrative["fax-no"]) || ((_k = (_j = data.contacts) === null || _j === void 0 ? void 0 : _j.administrative) === null || _k === void 0 ? void 0 : _k.name) || ((_m = (_l = data.contacts) === null || _l === void 0 ? void 0 : _l.administrative) === null || _m === void 0 ? void 0 : _m.organisation) || ((_p = (_o = data.contacts) === null || _o === void 0 ? void 0 : _o.administrative) === null || _p === void 0 ? void 0 : _p.phone));
    if (resultData.hasAdminInfo) {
        resultData.adminInfo = getTldWhoisContactInfo(data, "administrative");
    }
    resultData.hasTechInfo = !!(((_r = (_q = data.contacts) === null || _q === void 0 ? void 0 : _q.technical) === null || _r === void 0 ? void 0 : _r.address) || ((_t = (_s = data.contacts) === null || _s === void 0 ? void 0 : _s.technical) === null || _t === void 0 ? void 0 : _t.contact) || ((_u = data.contacts) === null || _u === void 0 ? void 0 : _u.technical["e-mail"]) || ((_v = data.contacts) === null || _v === void 0 ? void 0 : _v.technical["fax-no"]) || ((_x = (_w = data.contacts) === null || _w === void 0 ? void 0 : _w.technical) === null || _x === void 0 ? void 0 : _x.name) || ((_z = (_y = data.contacts) === null || _y === void 0 ? void 0 : _y.technical) === null || _z === void 0 ? void 0 : _z.organisation) || ((_1 = (_0 = data.contacts) === null || _0 === void 0 ? void 0 : _0.technical) === null || _1 === void 0 ? void 0 : _1.phone));
    if (resultData.hasTechInfo) {
        resultData.techInfo = getTldWhoisContactInfo(data, "technical");
    }
    if (data.__raw)
        resultData.raw = data.__raw;
    return resultData;
}
function getTldWhoisContactInfo(data, type) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const contactInfo = {};
    contactInfo.name = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.contacts) === null || _a === void 0 ? void 0 : _a[type]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : undefined;
    contactInfo.organization = (_f = (_e = (_d = data === null || data === void 0 ? void 0 : data.contacts) === null || _d === void 0 ? void 0 : _d[type]) === null || _e === void 0 ? void 0 : _e.organisation) !== null && _f !== void 0 ? _f : undefined;
    contactInfo.address = (_j = (_h = (_g = data === null || data === void 0 ? void 0 : data.contacts) === null || _g === void 0 ? void 0 : _g[type]) === null || _h === void 0 ? void 0 : _h.address) !== null && _j !== void 0 ? _j : undefined;
    contactInfo.phone = (_m = (_l = (_k = data === null || data === void 0 ? void 0 : data.contacts) === null || _k === void 0 ? void 0 : _k[type]) === null || _l === void 0 ? void 0 : _l.phone) !== null && _m !== void 0 ? _m : undefined;
    contactInfo.email = (_q = (_p = (_o = data === null || data === void 0 ? void 0 : data.contacts) === null || _o === void 0 ? void 0 : _o[type]) === null || _p === void 0 ? void 0 : _p["e-mail"]) !== null && _q !== void 0 ? _q : undefined;
    contactInfo.fax = (_t = (_s = (_r = data === null || data === void 0 ? void 0 : data.contacts) === null || _r === void 0 ? void 0 : _r[type]) === null || _s === void 0 ? void 0 : _s["fax-no"]) !== null && _t !== void 0 ? _t : undefined;
    return contactInfo;
}
