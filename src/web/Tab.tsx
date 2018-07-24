import * as React from "react";
import {StatelessComponent} from "react";

export interface TabProps {
    className?: string;
}

export const Tab: StatelessComponent<TabProps> = ({children, className}) => {
    className = ["App-Tab has-background-white", className].join(" ");
    return (
        <div className={className}>{children}</div>
    );
};