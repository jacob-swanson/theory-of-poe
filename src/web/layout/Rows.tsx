import * as React from "react";
import {StatelessComponent} from "react";
import "./Rows.css";
import {LayoutProps} from "./LayoutProps";
import {classNames} from "../../utils/classNames";

export const Rows: StatelessComponent<LayoutProps> = ({children, className}) => (
    <div className={classNames("Rows", className)}>{children}</div>
);