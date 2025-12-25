import {IncomingMessage, ServerResponse} from "node:http";
import RedirectService from "./Services/RedirectService.ts";
import NodeCache from "node-cache";
import CachingService from "./Services/CachingService.ts";

class Server {
    origin: string;
    cacheStorage: NodeCache;

    constructor(origin: string, cacheStorage: NodeCache) {
        this.origin = origin;
        this.cacheStorage = cacheStorage;
    }

    public async Request(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
        const url: string = req.url || "";
        const path: string = url.replace(process.env.HOST_NAME || "", "");

        try {
            const cachedValue = this.cacheStorage.get(CachingService.generateKeyFromRequest(req));
            if(cachedValue !== undefined) {
                // Response already cached
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(cachedValue));
                return;
            }

            const response = await RedirectService.SendRequest(req, res, path, this.origin);
            this.cacheStorage.set(CachingService.generateKeyFromRequest(req), response);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            // @ts-ignore
            res.end(JSON.stringify({"error": e.message}));
        }

    }
}

export default Server;