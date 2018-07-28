import {HttpClient} from "../HttpClient";
import {HttpRequest} from "../HttpRequest";
import {LoggerFactory} from "../../logger/LoggerFactory";
import {FetchHttpResponse} from "./FetchHttpResponse";

export class FetchHttpClient extends HttpClient<FetchHttpResponse> {
    private log = LoggerFactory.getLogger(this);

    protected async execute(request: HttpRequest): Promise<FetchHttpResponse> {
        this.log.debug(`Executing HTTP request to ${request.url}`);
        return new FetchHttpResponse(await fetch(request.url));
    }
}