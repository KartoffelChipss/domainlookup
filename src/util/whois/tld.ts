import * as whoiser from "whoiser";
import {TldWhoisData,formatTldWhoisData} from ".";
import {WhoisSearchResult} from "whoiser";

/**
 * Get the WHOIS data for a TLD
 * @param tld The TLD to get WHOIS data for
 */
export function getTldWhoisData(tld: string): Promise<TldWhoisData> {
    return new Promise((resolve, reject) => {
        whoiser
            .tld(tld, { raw: true })
            .then((data: WhoisSearchResult) => {
                resolve(formatTldWhoisData(data));
            })
            .catch((err) => {
                if (err) {
                    reject(err);
                }
            });
    });
}