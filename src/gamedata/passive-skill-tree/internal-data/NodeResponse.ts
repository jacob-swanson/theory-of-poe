import {NodeType} from "../../Node";
import {Ascendancy, CharacterClass} from "../../Character";

export interface NodeResponse {
    id: string;
    name: string;
    icon: string;
    type: NodeType;
    className?: CharacterClass;
    ascendancyName?: Ascendancy;
    description: string[];
    orbit: number;
    orbitIndex: number;
    neighbors: string[]
}