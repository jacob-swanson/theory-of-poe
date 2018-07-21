import {HttpClient} from "../HttpClient";
import {HttpRequest} from "../HttpRequest";
import * as https from "https";
import * as url from "url";
import {LoggerFactory} from "../../logger/LoggerFactory";
import * as http from "http";
import {IncomingMessage} from "http";
import {NodeHttpResponse} from "./NodeHttpResponse";

export class NodeHttpClient extends HttpClient<NodeHttpResponse> {
    private log = LoggerFactory.getLogger(this);

    protected execute(request: HttpRequest): Promise<NodeHttpResponse> {
        return new Promise<NodeHttpResponse>((resolve, reject) => {
            this.log.debug(`Executing HTTP request to ${request.url}`);
            const parsedUrl = url.parse(request.url);
            const options = {
                ...parsedUrl,
                method: request.method
            };

            const protocol = parsedUrl.protocol || "http:";
            const isHttps = protocol === "https:";
            const responseCallback = (response: IncomingMessage) => {
                if (!response.statusCode || response.statusCode < 200 || response.statusCode > 299) {
                    reject(`Request failed with status ${response.statusCode}`);
                } else {
                    resolve(new NodeHttpResponse(response));
                }
            };
            const clientRequest = isHttps ?
                https.request(options, responseCallback) :
                http.request(options, responseCallback);
            clientRequest.on("error", (error) => {
                this.log.error("HTTP request failed");
                reject(error);
            });
            clientRequest.end();
        });
    }
}