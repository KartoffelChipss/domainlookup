import {WhoisSearchResult} from "whoiser";
import * as whoiser from "whoiser";
import {getFormattedPrice} from "../tldPricing";
import {formatWhoisData,WhoisData} from ".";

/**
 * Get the WHOIS data for a domain
 * @param domain The domain to get WHOIS data for
 */
export function getDomainWhoisData(domain: string): Promise<WhoisData> {
    const domainSplit = domain.split(".");
    return new Promise((resolve, reject) => {
        whoiser
            .domain(domain, { raw: true })
            .then((data: WhoisSearchResult) => {
                resolve(formatWhoisData(data, getFormattedPrice(domainSplit[domainSplit.length - 1])));
            })
            .catch((err) => {
                if (err) {
                    reject(err);
                }
            });
    });
}

/**
 * Check if a domain is available
 * @param whoisData The WHOIS data to check
 */
export function isDomainAvailable(whoisData: WhoisData): boolean {
    if (!whoisData.status || whoisData.status.length === 0) return true;

    const unavailableStatuses = [
        "registered",
        "active",
        "clientTransferProhibited",
        "clientHold",
        "serverTransferProhibited",
        "serverHold",
        "pendingRenewal",
        "pendingTransfer"
    ];

    for (const status of whoisData.status) {
        if (unavailableStatuses.includes(status.toLowerCase())) return false;
    }

    return true;
}