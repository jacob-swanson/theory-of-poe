import * as React from "react";
import {StatelessComponent} from "react";

export const Tabs: StatelessComponent = ({children}) => {
    return (
        <div className="App-Tabs">
            <nav className="App-Header navbar is-light">
                <div className="navbar-start">
                    <a className="navbar-item is-active" href="#">
                        Passive Skill Tree
                    </a>
                </div>
            </nav>
            {children}
        </div>
    );
};
