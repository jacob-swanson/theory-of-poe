import * as React from "react";
import "./App.css";
import "bulma/css/bulma.css";
import {Content} from "./Content";
import {LeftSidebar} from "./LeftSidebar";
import {RightSidebar} from "./RightSidebar";
import {Tabs} from "./Tabs";
import {PassiveSkillTree} from "./PassiveSkillTree";
import {Route} from "react-router";
import {PassiveSkillTreePage} from "./pages/PassiveSkillTreePage";
import {GearPage} from "./pages/GearPage";
import {DetailsPage} from "./pages/DetailsPage";


export const App = () => (
    <div className="App">
        <PassiveSkillTree/>
        <Content>
            <LeftSidebar/>
            <Tabs>
                <Route path="/passive-skill-tree" component={PassiveSkillTreePage}/>
                <Route path="/gear" component={GearPage}/>
                <Route path="/details" component={DetailsPage}/>
            </Tabs>
            <RightSidebar/>
        </Content>
    </div>
);
