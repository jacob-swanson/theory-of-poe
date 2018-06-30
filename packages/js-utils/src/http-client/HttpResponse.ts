import {Json} from "../Json";

export interface HttpResponse {
    json<T = Json>(): Promise<T>;
}