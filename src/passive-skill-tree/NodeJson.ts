export interface NodeJsonMap {
    [key: string]: NodeJson
}

export interface NodeJson {
    da: number;
    dn: string;
    g: number;
    ia: number;
    id: number;
    isAscendancyStart: boolean;
    ascendancyName: string;
    isJewelSocket: boolean;
    isMultipleChoice: boolean;
    isMultipleChoiceOption: boolean;
    ks: boolean;
    m: boolean;
    not: boolean;
    o: number;
    oidx: number;
    out: number[];
    passivePointsGranted: number;
    reminderText: string;
    sa: number;
    sd: string[];
    spc: void[];
    icon: string
}