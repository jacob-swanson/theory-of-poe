import * as React from "react";
import {StatelessComponent} from "react";
import "./Columns.css";
import {LayoutProps} from "./LayoutProps";
import {classNames} from "../../utils/classNames";

export const Columns: StatelessComponent<LayoutProps> = ({children, className}) => (
    <div className={classNames("Columns", className)}>{children}</div>
);