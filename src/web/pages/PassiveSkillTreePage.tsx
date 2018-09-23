import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {inject, observer} from "mobx-react";
import {Content} from "../components/Content";
import "./PassiveSkillTreePage.css";
import {PassiveSkillTree} from "../passive-skill-tree/PassiveSkillTree";

@observer
export class PassiveSkillTreePage extends Component<RouteComponentProps<any>> {
    public render() {
        return (
            <Content className="PassiveSkillTreePage">
                <PassiveSkillTree/>
            </Content>
        );
    }
}