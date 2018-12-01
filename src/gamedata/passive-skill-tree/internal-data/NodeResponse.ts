import {NodeType} from "../../Node";

export interface NodeResponse {
    id: string;
    name: string;
    icon: string;
    type: NodeType;
    description: string[];
    orbit: number;
    orbitIndex: number;
    neighbors: string[]
}