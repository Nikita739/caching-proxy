import * as http from "node:http";
import {IncomingMessage, ServerResponse} from "node:http";

class RedirectService {
    public async SendRequest(req: IncomingMessage,
                       res: ServerResponse<IncomingMessage>, path: string, url: string) {
        // http.request(req, (res) => {
        //     let data: string = '';
        //
        //     res.on('data', (chunk) => {
        //         data += chunk;
        //     });
        //
        //     res.on('end', () => {
        //         const jsonData = JSON.parse(data);
        //         console.log(jsonData);
        //         return jsonData;
        //     });
        // }).on('error', (err) => {
        //     console.error("Error: " + err.message);
        // });

        console.log("FETCH SERVER: " + path);
        const response = await fetch(`http://${url}${path}`, {
            method: "GET",
            headers: {
                "Content-Type": req.headers["content-type"] || "application/json",
                "Accept": req.headers.accept || "application/json"
            }
        });
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("HTTP error status: " + response.status);
        }
    }
}

export default new RedirectService();