import * as React from "react";
import {StatelessComponent} from "react";
import {RouteComponentProps} from "react-router";
import {Content} from "../components/Content";

export const GearPage: StatelessComponent<RouteComponentProps<any>> = ({match}) => (
    <Content>
        Gear Page
    </Content>
);