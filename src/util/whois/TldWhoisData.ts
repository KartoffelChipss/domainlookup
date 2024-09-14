export interface TldWhoisData {
    domain: string;
    created?: string;
    changed?: string;
    organization?: string;
    status?: string;
    whoisServer?: string;
    hasAdminInfo?: boolean;
    adminInfo?: TldWhoisContactInfo;
    hasTechInfo?: boolean;
    techInfo?: TldWhoisContactInfo;
    raw?: string;
    cachedAt?: number;
}

export interface TldWhoisContactInfo {
    name: string;
    organization?: string;
    address?: string;
    phone?: string;
    email?: string;
    fax?: string;
}