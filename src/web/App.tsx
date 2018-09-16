import * as React from "react";
import {Component} from "react";
import {observer} from "mobx-react";
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

@observer
export class App extends Component {
    private uiState = new UiState();

    public render() {
        return (
            <HashRouter>
                <Layout className="App">
                    <Sidebar
                        isSidebarVisible={this.uiState.isSidebarVisible}
                        toggleSidebar={this.uiState.toggleSidebar}
                    />
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
                </Layout>
            </HashRouter>
        );
    }
}