import {Group, GroupBackgroundType} from "../../gamedata/Group";
import {Node, NodeType} from "../../gamedata/Node";
import * as PIXI from "pixi.js";
import {bind} from "../../utils/bind";
import {autorun, IReactionDisposer} from "mobx";
import ColorMatrixFilter = PIXI.filters.ColorMatrixFilter;

const AscendancyBackgroundsByAscendancyName = {
    Ascendant: "ClassesAscendant",
    Assassin: "ClassesAssassin",
    Berserker: "ClassesBerserker",
    Champion: "ClassesChampion",
    Chieftain: "ClassesChieftain",
    Deadeye: "ClassesDeadeye",
    Elementalist: "ClassesElementalist",
    Gladiator: "ClassesGladiator",
    Guardian: "ClassesGuardian",
    Hierophant: "ClassesHierophant",
    Inquisitor: "ClassesInquisitor",
    Juggernaut: "ClassesJuggernaut",
    Necromancer: "ClassesNecromancer",
    Occultist: "ClassesOccultist",
    Pathfinder: "ClassesPathfinder",
    Raider: "ClassesRaider",
    Saboteur: "ClassesSaboteur",
    Slayer: "ClassesSlayer",
    Trickster: "ClassesTrickster"
};

export class AscendancyGroupView extends PIXI.Container {
    private readonly ascendancyStartNode: Node;
    private readonly filter: ColorMatrixFilter;
    private dispose: IReactionDisposer;

    constructor(private readonly group: Group) {
        super();

        for (const node of group.nodes) {
            if (node.type === NodeType.AscendancyStart) {
                this.ascendancyStartNode = node;
                break;
            }
        }
        if (!this.ascendancyStartNode) {
            throw new Error("No ascendancy start node found");
        }

        this.x = group.position.x;
        this.y = group.position.y;

        if (group.backgroundType !== GroupBackgroundType.Ascendancy || !group.ascendancyName) {
            throw new Error("Group was not an ascendancy background");
        }

        const assetName = AscendancyBackgroundsByAscendancyName[group.ascendancyName];
        const resource = PIXI.loader.resources[assetName];
        if (!resource) {
            throw new Error(`No resource found for ${assetName}`);
        }

        const ascendancySprite = new PIXI.Sprite(resource.texture);
        ascendancySprite.anchor.x = 0.5;
        ascendancySprite.anchor.y = 0.5;

        this.filter = new PIXI.filters.ColorMatrixFilter();
        ascendancySprite.filters = [this.filter];
        this.addChild(ascendancySprite);

        this.dispose = autorun(this.update);
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }

    @bind
    private update() {
        this.filter.brightness(this.ascendancyStartNode.isAllocated ? 1 : 0.5);
    }
}