export interface WhoisData {
    domain: string;
    registrar?: string;
    creationDate?: string;
    updatedDate?: string;
    expiryDate?: string;
    status?: string[];
    nameServers?: string[];
    cfPrice?: string;
    hasRegistrantInfo?: boolean;
    registrantInfo?: WhoisContactInfo;
    hasAdminInfo?: boolean;
    adminInfo?: WhoisContactInfo;
    hasTechInfo?: boolean;
    techInfo?: WhoisContactInfo;
    raw?: string;
    cachedAt?: number;
}

export interface WhoisContactInfo {
    name: string;
    organization: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    fax: string;
    email: string;
}