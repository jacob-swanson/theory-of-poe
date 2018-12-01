import {NodeResponse} from "./NodeResponse";

export interface GroupResponse {
    id: string;
    x: number;
    y: number;
    nodes: NodeResponse[];
}