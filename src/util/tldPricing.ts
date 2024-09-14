import path from "path";

const dataDir = path.resolve(`${process.cwd()}${path.sep}src`);
const utilDir = path.resolve(path.join(dataDir, "util"));
const tldPricingDir = path.resolve(`${utilDir}${path.sep}tldpricing`);

export interface CFPrice {
    tld_name: string;
    renewal_price_usd: string;
    registration_price_usd: string;
}

const cfPricing: CFPrice[] = require(path.join(tldPricingDir, "cloudflare.json")) as CFPrice[];

function formatPrice(price: string) {
    var formattedPrice = parseFloat(price).toFixed(2);
    return "$" + formattedPrice;
}

export function getPrice(tld: string): string|null {
    const cfPrice: CFPrice|undefined = cfPricing.find((tldPricing: CFPrice): boolean => tldPricing.tld_name === tld);
    return cfPrice ? cfPrice.registration_price_usd : null;
}

export function getFormattedPrice(tld: string): string|null {
    const price: string|null = getPrice(tld);
    return price ? formatPrice(price) : null;
}