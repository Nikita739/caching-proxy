class ProxyOptions {
    public port: number = 0;
    public origin: string = "";

    constructor(port: number, origin: string, ...params: any[]) {
        this.port = port;
        this.origin = origin;
    }
}

export default ProxyOptions;