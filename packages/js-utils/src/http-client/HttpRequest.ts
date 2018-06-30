export type RequestMethod = "get" | "put" | "post" | "delete";

export class HttpRequest {
    constructor(readonly method: RequestMethod,
                readonly url: string) {
    }
}