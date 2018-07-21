import * as React from "react";
import {StatelessComponent} from "react";

export interface TabProps {
    title: string;
}

export const Tab: StatelessComponent<TabProps> = ({title, children}) => (<div className="App-Tab">{children}</div>);