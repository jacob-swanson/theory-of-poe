import {PassiveTreeState} from "./PassiveTreeState";
import {AscendanciesByClass, Ascendancy, CharacterClass} from "./NodeState";
import {action, observable} from "mobx";

export class CharacterState {
    @observable public className: CharacterClass = CharacterClass.Scion;
    @observable public ascendancy: Ascendancy = Ascendancy.Ascendant;

    constructor(public readonly passiveTree: PassiveTreeState) {
        passiveTree.character = this;
    }

    @action
    public setClass(value: CharacterClass) {
        if (value === this.className) {
            return;
        }
        this.className = value;
        this.resetAscendancy();
    }

    @action
    public resetAscendancy() {
        this.setAscendancy(AscendanciesByClass[this.className][0]);
    }

    @action
    public setAscendancy(value: Ascendancy) {
        if (value === this.ascendancy) {
            return;
        }
        this.ascendancy = value;
    }
}