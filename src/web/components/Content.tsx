import * as React from "react";
import {StatelessComponent} from "react";
import "./Content.css";
import {classNames} from "../../utils/classNames";

export interface ContentProps {
    className?: string;
    isTransparent?: boolean;
}

export const Content: StatelessComponent<ContentProps> = ({children, className, isTransparent}) => (
    <div className={classNames("Content", className, {isTransparent})}>{children}</div>
);