import * as React from "react";
import {StatelessComponent} from "react";
import "./Layout.css";
import {classNames} from "../../utils/classNames";
import {FlexDirectionProperty} from "csstype";

export interface LayoutProps {
    className?: string;
    orientation?: FlexDirectionProperty;
}

export const Layout: StatelessComponent<LayoutProps> = ({children, className, orientation}) => {
    className = classNames("Layout", className);
    const style = {flexDirection: orientation};
    return (
        <div
            className={className}
            style={style}
        >
            {children}
        </div>
    );
};