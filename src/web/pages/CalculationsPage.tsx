import * as React from "react";
import {RouteComponentProps} from "react-router";
import {Content} from "../components/Content";
import {FunctionComponent} from "react";

export const CalculationsPage: FunctionComponent<RouteComponentProps<any>> = ({match}) => (
    <Content>
        Calculations Page
    </Content>
);