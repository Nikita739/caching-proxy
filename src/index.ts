#!/usr/bin/env node

import { program } from "commander";
import ProxyOptions from "./TransferObjects/ProxyOptions.ts";
import * as http from "node:http";
import Server from "./server.ts";
import NodeCache from "node-cache";

import dotenv from 'dotenv';
dotenv.config();

const hostName = "127.0.0.1";

const cacheStorage = new NodeCache();

program
    .version("1.0.0")
    .description("Server cashing CLI")
    .option("-p, --port <number>", "Port")
    .option("--origin <url>")
    .action((options) => {
        const proxyOptions: ProxyOptions = new ProxyOptions(options.port, options.origin);
        const serverHandler: Server = new Server(options.origin, cacheStorage);

        const server = http.createServer((req, res) => {
            serverHandler.Request(req, res);
        });

        server.listen(options.port, hostName, () => {
            console.log(`Proxy running at http://${hostName}:${options.port}/`);
        });
    });

program.parse(process.argv);