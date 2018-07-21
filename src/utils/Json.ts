export type Json = boolean | number | string | null | JsonArray | JsonObject;

export interface JsonObject {
    [key: string]: Json;
}

export interface JsonArray extends Array<Json> {
}