import * as React from "react";
import {Component} from "react";
import "./App.css";
import "bulma/css/bulma.css";
import {LeftSidebar} from "./LeftSidebar";
import {CenterNavbar} from "./CenterNavbar";
import {Route} from "react-router";
import {PassiveSkillTreePage} from "./pages/PassiveSkillTreePage";
import {GearPage} from "./pages/GearPage";
import {DetailsPage} from "./pages/DetailsPage";
import {Rows} from "./layout/Rows";
import {NestedRows} from "./layout/NestedRows";
import {Item} from "./layout/Item";
import {PassiveSkillTreeService} from "../gamedata/passive-skill-tree/PassiveSkillTreeService";
import {FetchHttpClient} from "../utils/http-client/fetch/FetchHttpClient";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {LoggerFactory} from "../utils/logger/LoggerFactory";
import {PassiveSkillTree} from "./PassiveSkillTree";
import {PassiveSkillTreeOptionsJson} from "../gamedata/passive-skill-tree/external-data/PassiveSkillTreeOptionsJson";

const httpClient = new FetchHttpClient();
const passiveSkillTreeService = new PassiveSkillTreeService("http://localhost:3000/gamedata/", httpClient);

@observer
export class App extends Component {
    private log = LoggerFactory.getLogger(this);

    @observable
    private isLoaded = false;

    private data: PassiveSkillTreeOptionsJson | undefined;

    public async componentDidMount(): Promise<void> {
        const version = await passiveSkillTreeService.getVersions()[0];
        this.data = await passiveSkillTreeService.getDataForVersion(version);
        this.log.info("Loaded", this.data);
        this.isLoaded = true;
    }

    public render() {
        return (
            <Rows className="App">
                {this.isLoaded && this.data ? <PassiveSkillTree data={this.data}/> : null}
                <Item isColumns={true}>
                    <LeftSidebar/>
                    <NestedRows>
                        <CenterNavbar/>
                        <Route path="/passive-skill-tree" component={PassiveSkillTreePage}/>
                        <Route path="/gear" component={GearPage}/>
                        <Route path="/details" component={DetailsPage}/>
                    </NestedRows>
                </Item>
            </Rows>
        );
    }
}