import {HttpResponse} from "../HttpResponse";

export class FetchHttpResponse implements HttpResponse {
    private response: Response;

    constructor(response: Response) {
        this.response = response;
    }


    public async json<T>(): Promise<T> {
        return await this.response.json();
    }
}
