import * as React from "react";
import {StatelessComponent} from "react";
import {RouteComponentProps} from "react-router";
import {Content} from "../components/Content";

export const CalculationsPage: StatelessComponent<RouteComponentProps<any>> = ({match}) => (
    <Content>
        Calculations Page
    </Content>
);