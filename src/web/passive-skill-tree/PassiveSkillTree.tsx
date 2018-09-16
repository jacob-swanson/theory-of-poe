import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";
import {observable} from "mobx";
import * as _ from "lodash";
import {SmallGroup} from "./groups/SmallGroup";
import {PassiveSkillTreeOptionsJson} from "../../gamedata/passive-skill-tree/external-data/PassiveSkillTreeOptionsJson";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {Stage} from "../webgl/Stage";
import "./PassiveSkillTree.css";

export interface PassiveSkillTreeProps {
    data: PassiveSkillTreeOptionsJson
}

@observer
export class PassiveSkillTree extends Component<PassiveSkillTreeProps> {
    @observable protected width = window.innerWidth;
    @observable protected height = window.innerHeight;

    private log = LoggerFactory.getLogger(this);

    private onWindowResize = _.debounce(() => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }, 64);

    public componentDidMount(): void {
        this.onWindowResize();
        window.addEventListener("resize", this.onWindowResize);
    }

    public componentWillUnmount(): void {
        window.removeEventListener("resize", this.onWindowResize);
    }

    public render() {
        const groups = this.getGroups();
        this.log.debug("Got groups", groups.length);
        return (
            <Stage className="PassiveSkillTree" width={this.width} height={this.height} backgroundColor={0x10bb99}>
                {groups}
            </Stage>
        );
    }

    private getGroups() {
        if (!this.props.data) {
            return [];
        }
        return Object.entries(this.props.data.passiveSkillTreeData.groups)
            .map(([key, json]) => {
                const x = json.x * 0.3835;
                const y = json.y * 0.3835;

                if (json.oo[3]) {
                    return <SmallGroup key={key} x={x} y={y}/>;
                } else if (json.oo[2]) {
                    return <SmallGroup key={key} x={x} y={y}/>;
                } else if (json.oo[1]) {
                    return <SmallGroup key={key} x={x} y={y}/>;
                }
                return null;
            }).filter(group => !!group);
    }
}