import * as React from "react";
import {Component} from "react";
import {RouteComponentProps} from "react-router";
import {observer} from "mobx-react";
import {Content} from "../components/Content";
import {PassiveSkillTree} from "../passive-skill-tree/PassiveSkillTree";
import {observable} from "mobx";
import {PassiveSkillTreeOptionsJson} from "../../gamedata/passive-skill-tree/external-data/PassiveSkillTreeOptionsJson";
import {FetchHttpClient} from "../../utils/http-client/fetch/FetchHttpClient";
import {PassiveSkillTreeService} from "../../gamedata/passive-skill-tree/PassiveSkillTreeService";
import "./PassiveSkillTreePage.css";

const httpClient = new FetchHttpClient();
const passiveSkillTreeService = new PassiveSkillTreeService("http://localhost:3000/gamedata/", httpClient);

@observer
export class PassiveSkillTreePage extends Component<RouteComponentProps<any>> {
    @observable.shallow private data: PassiveSkillTreeOptionsJson | null = null;

    public async componentDidMount() {
        const versions = await passiveSkillTreeService.getVersions();
        this.data = await passiveSkillTreeService.getDataForVersion(versions[0]);
    }


    public render() {
        return (
            <Content className="PassiveSkillTreePage" isTransparent={true}>
                {this.data ? <PassiveSkillTree data={this.data}/> : null}
            </Content>
        );
    }
}