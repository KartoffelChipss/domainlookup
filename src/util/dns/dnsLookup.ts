import dns from "node:dns";
import {ARecord, DnsData, MXRecord} from ".";
import geoip, {Lookup} from "geoip-lite";
import {getCountryByCode} from "../../main";

export async function lookupDnsData(hostname: string): Promise<DnsData> {
    const [A, AAAA, MX, NS, CNAME, TXT] = await Promise.all([
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
}

function lookupARecords(hostname: string): Promise<ARecord[]> {
    return new Promise((resolve, reject) => {
        dns.resolve4(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            const records: ARecord[] = [];
            for (const ip of ret) {
                const geo: Lookup | null = geoip.lookup(ip);
                const countryName = (geo ? getCountryByCode(geo.country)?.name : "Unknown") || "Unknown";
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

function lookupAAAARecords(hostname: string): Promise<ARecord[]> {
    return new Promise((resolve, reject) => {
        dns.resolve6(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            const records: ARecord[] = [];
            for (const ip of ret) {
                const geo: Lookup | null = geoip.lookup(ip);
                const countryName = (geo ? getCountryByCode(geo.country)?.name : "Unknown") || "Unknown";
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

function lookupMXRecords(hostname: string): Promise<MXRecord[]> {
    return new Promise((resolve, reject) => {
        dns.resolveMx(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            const records: MXRecord[] = [];
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

export function lookupNSRecords(hostname: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        dns.resolveNs(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            return resolve(ret);
        });
    });
}

function lookupCNAME(hostname: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        dns.resolveCname(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            return resolve(ret);
        });
    });
}

function lookupTXT(hostname: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        dns.resolveTxt(hostname, (err, ret) => {
            if (err) {
                resolve([]);
                return;
            }

            return resolve(ret.map((txt) => txt.join(" ")));
        });
    });
}