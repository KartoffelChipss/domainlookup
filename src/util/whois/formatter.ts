import {WhoisSearchResult} from "whoiser";
import {TldWhoisContactInfo, TldWhoisData, WhoisContactInfo, WhoisData} from ".";

/**
 * Formats the whois data into a more usable format
 * @param whoisData The raw whois data
 */
export function formatWhoisData(whoisData: WhoisSearchResult, cfPrice: string|null = null): WhoisData {
    let data: any = {};

    for (let servername in whoisData) {
        for (let label in whoisData[servername] as any) {
            data[label] = (whoisData as any)[servername][label];
        }
    }

    const resultData: Partial<WhoisData> = {};

    if (data["Domain Name"]) resultData.domain = data["Domain Name"] as string;
    if (data["Registrar"]) resultData.registrar = data["Registrar"] as string;
    if (data["Created Date"]) resultData.creationDate = data["Created Date"] as string;
    if (data["Expiry Date"]) resultData.expiryDate = data["Expiry Date"] as string;
    if (data["Updated Date"]) resultData.updatedDate = data["Updated Date"] as string;

    resultData.status = [];
    if (data["Domain Status"] && Array.isArray(data["Domain Status"])) {
        for (let status of data["Domain Status"] as string[]) {
            resultData.status.push((status.split(" ")[0] ?? status).trim());
        }
    }

    resultData.nameServers = [];
    if (data["Name Server"] && Array.isArray(data["Name Server"])) {
        for (let ns of data["Name Server"] as string[]) {
            resultData.nameServers.push((ns.split(" ")[0] ?? ns).trim());
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

    if (data.__raw) resultData.raw = data.__raw;

    if (cfPrice) resultData.cfPrice = cfPrice;

    return resultData as WhoisData;
}

function getWhoisContactInfo(data: any, type: string): WhoisContactInfo {
    const contactInfo: Partial<WhoisContactInfo> = {};
    if (data[`${type} Name`]) contactInfo.name = data[`${type} Name`];
    if (data[`${type} Organization`]) contactInfo.organization = data[`${type} Organization`];
    if (data[`${type} Street`]) contactInfo.street = data[`${type} Street`];
    if (data[`${type} City`]) contactInfo.city = data[`${type} City`];
    if (data[`${type} State/Province`]) contactInfo.state = data[`${type} State/Province`];
    if (data[`${type} Postal Code`]) contactInfo.postalCode = data[`${type} Postal Code`];
    if (data[`${type} Country`]) contactInfo.country = data[`${type} Country`];
    if (data[`${type} Phone`]) contactInfo.phone = data[`${type} Phone`];
    if (data[`${type} Fax`]) contactInfo.fax = data[`${type} Fax`];
    if (data[`${type} Email`]) contactInfo.email = data[`${type} Email`];

    return contactInfo as WhoisContactInfo;
}

/**
 * Formats the TLD whois data into a more usable format
 * @param data The raw whois data
 */
export function formatTldWhoisData(data: any): TldWhoisData {
    const resultData: Partial<TldWhoisData> = {};

    if (data["domain"]) resultData.domain = data["domain"] as string;
    if (data["created"]) resultData.created = data["created"] as string;
    if (data["changed"]) resultData.changed = data["changed"] as string;
    if (data.organisation?.organisation) resultData.organization = data.organisation?.organisation as string;
    if (data["status"]) resultData.status = data["status"] as string;
    if (data["whois"]) resultData.whoisServer = data["whois"] as string;

    resultData.hasAdminInfo = !!(data.contacts?.administrative?.address || data.contacts?.administrative?.contact || data.contacts?.administrative["e-mail"] || data.contacts?.administrative["fax-no"] || data.contacts?.administrative?.name || data.contacts?.administrative?.organisation || data.contacts?.administrative?.phone)
    if (resultData.hasAdminInfo) {
        resultData.adminInfo = getTldWhoisContactInfo(data, "administrative");
    }

    resultData.hasTechInfo = !!(data.contacts?.technical?.address || data.contacts?.technical?.contact || data.contacts?.technical["e-mail"] || data.contacts?.technical["fax-no"] || data.contacts?.technical?.name || data.contacts?.technical?.organisation || data.contacts?.technical?.phone)
    if (resultData.hasTechInfo) {
        resultData.techInfo = getTldWhoisContactInfo(data, "technical");
    }
    if (data.__raw) resultData.raw = data.__raw as string;

    return resultData as TldWhoisData;
}

function getTldWhoisContactInfo(data: any, type: string): TldWhoisContactInfo {
    const contactInfo: Partial<TldWhoisContactInfo> = {};

    contactInfo.name = data?.contacts?.[type]?.name ?? undefined;
    contactInfo.organization = data?.contacts?.[type]?.organisation ?? undefined;
    contactInfo.address = data?.contacts?.[type]?.address ?? undefined;
    contactInfo.phone = data?.contacts?.[type]?.phone ?? undefined;
    contactInfo.email = data?.contacts?.[type]?.["e-mail"] ?? undefined;
    contactInfo.fax = data?.contacts?.[type]?.["fax-no"] ?? undefined;

    return contactInfo as TldWhoisContactInfo;
}