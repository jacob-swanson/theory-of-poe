import * as React from "react";
import "./App.css";
import "bulma/css/bulma.css";
import {Header} from "./Header";
import {Footer} from "./Footer";
import {Content} from "./Content";
import {LeftSidebar} from "./LeftSidebar";
import {RightSidebar} from "./RightSidebar";
import {Tabs} from "./Tabs";
import {Tab} from "./Tab";
import {PassiveSkillTree} from "./PassiveSkillTree";


export const App = () => (
    <div className="App">
        <PassiveSkillTree/>
        <Header/>
        <Content>
            <LeftSidebar/>
            <Tabs>
                <Tab title="Passive Tree"/>
            </Tabs>
            <RightSidebar/>
        </Content>
        <Footer/>
    </div>
);
