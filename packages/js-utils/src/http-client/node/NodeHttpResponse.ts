import {WriteStream} from "fs";
import {IncomingMessage} from "http";
import {HttpResponse} from "../HttpResponse";

export class NodeHttpResponse implements HttpResponse {
    private response: IncomingMessage;

    constructor(response: IncomingMessage) {
        this.response = response;
    }

    public async pipe(destination: WriteStream): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.response.pipe(destination);
            destination.on("finish", () => {
                resolve();
            });
        });
    }

    public async json<T>(): Promise<T> {
        const buffer = await this.buffer();
        return JSON.parse(buffer.toString());
    }

    public async buffer(): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const buffer: Buffer[] = [];
            this.response.on("data", (chunk: Buffer) => {
                buffer.push(chunk);
            });
            this.response.on("end", () => {
                resolve(Buffer.concat(buffer));
            });
        });
    }
}
