import {LayoutProps} from "./LayoutProps";
import {MouseEventHandler} from "react";

export interface ItemProps extends LayoutProps {
    isColumns?: boolean;
    isRows?: boolean;
    isNarrow?: boolean;
    isCenter?: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
}
