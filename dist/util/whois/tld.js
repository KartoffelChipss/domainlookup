"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTldWhoisData = getTldWhoisData;
const whoiser = __importStar(require("whoiser"));
const _1 = require(".");
/**
 * Get the WHOIS data for a TLD
 * @param tld The TLD to get WHOIS data for
 */
function getTldWhoisData(tld) {
    return new Promise((resolve, reject) => {
        whoiser
            .tld(tld, { raw: true })
            .then((data) => {
            resolve((0, _1.formatTldWhoisData)(data));
        })
            .catch((err) => {
            if (err) {
                reject(err);
            }
        });
    });
}
