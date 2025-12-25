import {IncomingMessage} from "node:http";

class CachingService {
    getCircularReplacer() {
        const seen = new WeakSet();
        return (key: any, value: object | null) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return; // returns undefined, effectively omitting the property
                }
                seen.add(value);
            }
            return value;
        };
    };

    stringifyJson(obj: any): string {
        return JSON.stringify(obj, this.getCircularReplacer());
    }

    generateKeyFromRequest(request: IncomingMessage): string {
        const payload = {
            headers: request.headers,
            url: request.url
        };

        return this.stringifyJson(payload);
    }
}

export default new CachingService();