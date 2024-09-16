import {Request, Response, Router} from 'express';
import NodeCache from "node-cache";
import {requireAuth} from "../util/auth";
import {getDomainWhoisData,getTldWhoisData} from "../util/whois";
import {DnsData, lookupNSRecords} from "../util/dns";
import {lookupDnsData} from "../util/dns";

const whoisCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });
const dnsCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the PluginZ api!');
});

router.get("/domain/:query", requireAuth, (req: Request, res: Response) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(domain);

    if (cachedResult && !forceReload) {
        //console.log('Result for %s found in cache', domain);
        return res.send(cachedResult).status(200);
    }

    getDomainWhoisData(domain)
        .then((data) => {
            res.send(data);
            res.status(200);
            data.cachedAt = new Date().getTime();
            whoisCache.set(domain, data);
        })
        .catch((err) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    message: "An error occurred while checking whois data",
                    error: "Internal Server Error",
                    statusCode: 500
                })
            }
        });
});

router.get("/checkAvailability/:query", requireAuth, async (req: Request, res: Response) => {
    const domain = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cacheOnly = req.query.cacheOnly === "true";
    const cachedResult: any = dnsCache.get(domain);

    if (cachedResult && !forceReload) {
        return res.send({ status: "OK", available: cachedResult?.NS?.length <= 0, cachedAt: cachedResult?.cachedAt }).status(200);
    }

    if (cacheOnly) return res.send({ status: "ERROR", error: "No cached result found" }).status(500);

    lookupNSRecords(domain)
        .then((data) => {
            res.send({ status: "OK", available: data.length <= 0 }).status(200);
        })
        .catch((err) => {
            if (err) {
                console.error(err);
                res.status(500).send({
                    message: "An error occurred while checking domain availability",
                    error: "Internal Server Error",
                    statusCode: 500
                })
            }
        });
});

router.get("/tld/:query", requireAuth, (req: Request, res: Response) => {
    const tld = req.params.query;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = whoisCache.get(tld);

    if (cachedResult && !forceReload) {
        return res.status(200).send(cachedResult);
    }

    getTldWhoisData(tld)
        .then((data) => {
            res.send(data);
            res.status(200);
            whoisCache.set(tld, {
                ...data,
                cachedAt: new Date().getTime(),
            });
        })
        .catch((err) => {
            if (err) {
                console.error(err)
                res.status(500).send({
                    message: "An error occurred while checking whois data",
                    error: "Internal Server Error",
                    statusCode: 500
                })
            }
        });
});

router.get("/dns/:hostname", requireAuth, async (req: Request, res: Response) => {
    const hostname = req.params.hostname;
    const forceReload = req.query.forceReload === "true";
    const cachedResult = dnsCache.get(hostname);

    if (cachedResult && !forceReload) {
        // console.log('Result for %s found in cache', hostname);
        return res.status(200).send(cachedResult);
    }

    const dnsData: DnsData = await lookupDnsData(hostname);

    res.status(200).send(dnsData);
    dnsCache.set(hostname, {
        ...dnsData,
        cachedAt: new Date().getTime(),
    });
});

router.get("*", (req: Request, res: Response) => {
    res.status(404).send({
        message: "Cannot GET " + req.path,
        error: "Not Found",
        statusCode: 404
    });
});

export default router;