import * as React from "react";
import {StatelessComponent} from "react";

export const Tabs: StatelessComponent = ({children}) => {
    return (
        <div className="App-Tabs">
            <div className="tabs is-boxed has-background-light">
                <ul>
                    <li className="is-active"><a>Test 1</a></li>
                    <li><a>Test 2</a></li>
                    <li><a>Test 3</a></li>
                </ul>
            </div>
            {children}
        </div>
    );
};
