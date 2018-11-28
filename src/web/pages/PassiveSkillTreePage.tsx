import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import {Content} from "../components/Content";
import "./PassiveSkillTreePage.css";
import {PassiveTreeView} from "../mobx-pixi/PassiveTreeView";

@observer
export class PassiveSkillTreePage extends Component<RouteComponentProps<any>> {
    public render() {
        return (
            <Content className="PassiveSkillTreePage">
                <PassiveTreeView/>
            </Content>
        );
    }
}