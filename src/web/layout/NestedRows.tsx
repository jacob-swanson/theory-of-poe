import * as React from "react";
import {StatelessComponent} from "react";
import "./Rows.css";
import "./Item.css";
import {LayoutProps} from "./LayoutProps";
import {classNames} from "../../utils/classNames";

export const NestedRows: StatelessComponent<LayoutProps> = ({children, className}) => (
    <div className={classNames("Rows Item", className)}>{children}</div>
);