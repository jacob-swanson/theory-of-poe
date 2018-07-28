import * as React from "react";
import {StatelessComponent} from "react";
import "./Item.css";
import "./Columns.css";
import "./Rows.css";
import {classNames} from "../../utils/classNames";
import {ItemProps} from "./ItemProps";


export const Item: StatelessComponent<ItemProps> = ({children, className, isColumns, isRows, isNarrow, isCenter, onClick}) => (
    <div className={classNames("Item", className, {Rows: isRows, Columns: isColumns, "is-narrow": isNarrow, "is-center": isCenter})} onClick={onClick}>
        {children}
    </div>
);