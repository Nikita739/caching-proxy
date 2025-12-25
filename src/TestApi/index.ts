import * as http from "node:http";

const PORT: number = 4000;
const HOST: string = "localhost";

const validateRequest = (num1: string | null, num2: string | null): boolean => {
    if(!isNumeric(num1)) {
        throw new Error("Expected parameter 'num1'");
    } else if(!isNumeric(num2)) {
        throw new Error("Expected parameter 'num2'");
    }

    return true;
}

function isNumeric(str: any): boolean {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

const server = http.createServer((req, res) => {
    const fullUrl = new URL(req.url!, 'http://' + req.headers.host);
    const searchParams = fullUrl.searchParams;

    const num1 = searchParams.get('num1');
    const num2 = searchParams.get('num2');

    console.log("REQUEST TO ORIGIN SERVER");

    try {
        const validationResult = validateRequest(num1, num2);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({number: Number(num1!) * Number(num2!)}));
    } catch (e) {
        // @ts-ignore
        console.log("ERROR: " + e.message);
        res.statusCode = 400;
        // @ts-ignore
        res.end(JSON.stringify({"error": e.message}));
    }
});

server.listen(PORT, HOST, () => {
    console.log(`Test api started on port ${PORT}`);
});