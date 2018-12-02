import {Node} from "../../gamedata/Node";
import {autorun, IReactionDisposer} from "mobx";
import {PassiveTree} from "../../gamedata/PassiveTree";
import {bind} from "../../utils/bind";

export class LinkView extends PIXI.Graphics {
    private readonly isArc: boolean;
    private dispose: IReactionDisposer;

    constructor(private readonly from: Node, private readonly to: Node) {
        super();

        this.isArc = from.group === to.group && from.orbit === to.orbit;
        this.dispose = autorun(this.update);
    }

    public static create(from: Node) {
        const links = [];
        for (const to of from.neighbors) {
            const isGreater = from.id > to.id;
            const isAscendancy = from.ascendancyName !== to.ascendancyName;
            const isClassStart = from.isClassStart || to.isClassStart;
            const shouldDisplay = isGreater && !isAscendancy && !isClassStart;
            if (!shouldDisplay) {
                continue;
            }
            links.push(new LinkView(from, to));
        }
        return links;
    }

    public destroy(options?: PIXI.DestroyOptions | boolean): void {
        super.destroy(options);
        this.dispose();
    }

    @bind
    private update() {
        const isAllocated = this.from.isAllocated && this.to.isAllocated;
        const color = isAllocated ? 0x839574 : 0x373B33;
        const width = isAllocated ? 10 : 5;

        if (this.isArc) {
            const center = this.from.group.position;
            const radius = PassiveTree.orbitRadii[this.from.orbit];
            const fromTheta = 2 * Math.PI * this.from.orbitIndex / PassiveTree.skillsPerOrbit[this.from.orbit] - Math.PI / 2;
            const toTheta = 2 * Math.PI * this.to.orbitIndex / PassiveTree.skillsPerOrbit[this.to.orbit] - Math.PI / 2;

            let arcTheta = fromTheta - toTheta;
            if (arcTheta < 0) {
                arcTheta += 2 * Math.PI;
            }
            const clockwise = arcTheta < Math.PI;

            this.clear();
            this.lineStyle(width, color);
            this.arc(center.x, center.y, radius, fromTheta, toTheta, clockwise);
            this.endFill();
        } else {
            this.clear();
            this.lineStyle(width, color);
            this.moveTo(this.from.position.x, this.from.position.y);
            this.lineTo(this.to.position.x, this.to.position.y);
            this.endFill();
        }
    }
}