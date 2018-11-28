import * as express from "express";
import * as path from "path";
import * as proxy from "http-proxy-middleware";
import {ConsoleLogger} from "../utils/logger/ConsoleLogger";

const isDevelopment = process.env.NODE_ENV !== "production";

const log = new ConsoleLogger("Server");
const app = express();

if (isDevelopment) {
    const target = "http://localhost:3000";
    app.get("/*", proxy({target}));
    log.info(`Development Mode: Proxying requests to ${target}`);
} else {
    const contentRoot = path.join(__dirname, "..", "..", "build");
    app.use(express.static(contentRoot));

    app.get("/*", (req, res) => {
        res.sendFile(path.join(contentRoot, "index.html"));
    });
    log.info(`Production Mode: Serving content from ${contentRoot}`);
}

const port = process.env.PORT || 9000;
app.listen(port, () => {
    log.info(`Listening on http://localhost:${port}/`);
});