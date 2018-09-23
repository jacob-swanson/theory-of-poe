import * as React from "react";
import {Component} from "react";
import {observer, Provider} from "mobx-react";
import "./App.css";
import "bulma/css/bulma.css";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {PassiveSkillTreePage} from "./pages/PassiveSkillTreePage";
import {GearPage} from "./pages/GearPage";
import {CalculationsPage} from "./pages/CalculationsPage";
import {Layout} from "./components/Layout";
import {Sidebar} from "./components/Sidebar";
import {Navbar} from "./components/Navbar";
import {UiState} from "./stores/UiState";
import {observable} from "mobx";
import {PassiveSkillTreeStateFactory} from "./stores/passive-skill-tree/PassiveSkillTreeStateFactory";
import {FetchHttpClient} from "../utils/http-client/fetch/FetchHttpClient";
import {PassiveSkillTreeService} from "../gamedata/passive-skill-tree/PassiveSkillTreeService";
import {CharacterState} from "./stores/passive-skill-tree/CharacterState";
import DevTools from "mobx-react-devtools";

const httpClient = new FetchHttpClient();
const passiveSkillTreeService = new PassiveSkillTreeService("http://localhost:3000/gamedata/", httpClient);

@observer
export class App extends Component {
    private uiState = new UiState();

    @observable private character: CharacterState | null = null;

    public async componentDidMount() {
        const versions = await passiveSkillTreeService.getVersions();
        const json = await passiveSkillTreeService.getDataForVersion(versions[0]);
        this.character = new CharacterState(PassiveSkillTreeStateFactory.create(json));
    }

    public render() {
        return (
            <HashRouter>
                {this.renderApp()}
            </HashRouter>
        );
    }

    public renderApp() {
        if (this.character === null) {
            return (
                <span>Loading...</span>
            );
        }
        return (
            <Provider uiState={this.uiState} character={this.character}>
                <Layout className="App">
                    <Sidebar
                        isSidebarVisible={this.uiState.isSidebarVisible}
                        toggleSidebar={this.uiState.toggleSidebar}
                        character={this.character}/>
                    <Layout orientation="column">
                        <Navbar
                            characterId="new"
                            isSidebarVisible={this.uiState.isSidebarVisible}
                            toggleSidebar={this.uiState.toggleSidebar}
                        />
                        <Switch>
                            <Route path="/characters/:id/passive-skill-tree" component={PassiveSkillTreePage}/>
                            <Route path="/characters/:id/gear" component={GearPage}/>
                            <Route path="/characters/:id/calculations" component={CalculationsPage}/>
                            <Redirect to="/characters/new/passive-skill-tree"/>
                        </Switch>
                    </Layout>
                    <DevTools/>
                </Layout>
            </Provider>
        );
    }
}