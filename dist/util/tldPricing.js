"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrice = getPrice;
exports.getFormattedPrice = getFormattedPrice;
const path_1 = __importDefault(require("path"));
const dataDir = path_1.default.resolve(`${process.cwd()}${path_1.default.sep}src`);
const utilDir = path_1.default.resolve(path_1.default.join(dataDir, "util"));
const tldPricingDir = path_1.default.resolve(`${utilDir}${path_1.default.sep}tldpricing`);
const cfPricing = require(path_1.default.join(tldPricingDir, "cloudflare.json"));
function formatPrice(price) {
    var formattedPrice = parseFloat(price).toFixed(2);
    return "$" + formattedPrice;
}
function getPrice(tld) {
    const cfPrice = cfPricing.find((tldPricing) => tldPricing.tld_name === tld);
    return cfPrice ? cfPrice.registration_price_usd : null;
}
function getFormattedPrice(tld) {
    const price = getPrice(tld);
    return price ? formatPrice(price) : null;
}
