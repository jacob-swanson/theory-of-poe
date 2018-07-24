import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./web/App";
import "./web/index.css";
import registerServiceWorker from "./web/registerServiceWorker";
import {library} from "@fortawesome/fontawesome-svg-core";
import {fas} from "@fortawesome/free-solid-svg-icons";
import {fab} from "@fortawesome/free-brands-svg-icons";
import {BrowserRouter} from "react-router-dom";

library.add(fas, fab);

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
