import * as React from "react";
import {StatelessComponent} from "react";
import "./Columns.css";
import "./Item.css";
import {LayoutProps} from "./LayoutProps";
import {classNames} from "../../utils/classNames";

export const NestedColumns: StatelessComponent<LayoutProps> = ({children, className}) => (
    <div className={classNames("Columns Item", className)}>{children}</div>
);