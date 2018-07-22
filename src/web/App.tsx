import * as React from "react";
import "./App.css";
import "bulma/css/bulma.css";
import {Content} from "./Content";
import {LeftSidebar} from "./LeftSidebar";
import {RightSidebar} from "./RightSidebar";
import {Tabs} from "./Tabs";
import {Tab} from "./Tab";
import {PassiveSkillTree} from "./PassiveSkillTree";


export const App = () => (
    <div className="App">
        <PassiveSkillTree/>
        <Content>
            <LeftSidebar/>
            <Tabs>
                <Tab title="Passive Tree"/>
            </Tabs>
            <RightSidebar/>
        </Content>
    </div>
);
