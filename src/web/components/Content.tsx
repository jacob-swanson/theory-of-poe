import * as React from "react";
import {StatelessComponent} from "react";
import "./Content.css";
import {classNames} from "../../utils/classNames";

export interface ContentProps {
    className?: string;
}

export const Content: StatelessComponent<ContentProps> = ({children, className}) => (
    <div className={classNames("Content", className)}>{children}</div>
);