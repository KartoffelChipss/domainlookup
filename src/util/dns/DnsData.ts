import {Lookup} from "geoip-lite";

export interface DnsData {
    A: ARecord[];
    AAAA: ARecord[];
    CNAME: string[];
    TXT: string[];
    NS: string[];
    MX: MXRecord[];
}

export interface ARecord {
    ip: string;
    geo: Lookup|null;
    countryName: string;
}

export interface MXRecord {
    priority: number;
    exchange: string;
}