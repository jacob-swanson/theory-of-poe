import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import {Content} from "../components/Content";
import {PassiveSkillTree} from "../passive-skill-tree/PassiveSkillTree";
import {observable} from "mobx";
import {FetchHttpClient} from "../../utils/http-client/fetch/FetchHttpClient";
import {PassiveSkillTreeService} from "../../gamedata/passive-skill-tree/PassiveSkillTreeService";
import "./PassiveSkillTreePage.css";
import {PassiveTreeState} from "../stores/passive-skill-tree/PassiveTreeState";
import {PassiveSkillTreeStateFactory} from "../stores/passive-skill-tree/PassiveSkillTreeStateFactory";

const httpClient = new FetchHttpClient();
const passiveSkillTreeService = new PassiveSkillTreeService("http://localhost:3000/gamedata/", httpClient);

@observer
export class PassiveSkillTreePage extends Component<RouteComponentProps<any>> {
    @observable private data: PassiveTreeState | null = null;

    public async componentDidMount() {
        const versions = await passiveSkillTreeService.getVersions();
        const json = await passiveSkillTreeService.getDataForVersion(versions[0]);
        this.data = PassiveSkillTreeStateFactory.create(json);
    }


    public render() {
        return (
            <Content className="PassiveSkillTreePage">
                {this.data ? <PassiveSkillTree data={this.data}/> : null}
            </Content>
        );
    }
}