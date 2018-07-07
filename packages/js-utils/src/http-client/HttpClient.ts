import {HttpResponse} from "./HttpResponse";
import {HttpRequest} from "./HttpRequest";

export abstract class HttpClient<T extends HttpResponse = HttpResponse> {
    protected abstract execute(request: HttpRequest): Promise<T>;

    public get(url: string): Promise<T> {
        return this.execute(new HttpRequest("get", url));
    }
}