import * as React from "react";
import {faStroopwafel} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const LeftSidebar = () => (
    <aside className="App-LeftSidebar has-background-white">
        <nav className="App-Header navbar is-light">
            <div className="navbar-brand">
                <a className="navbar-item" href="#">
                <span className="icon">
                    <FontAwesomeIcon icon={faStroopwafel}/>
                </span>
                    <span>Theory of Poe</span>
                </a>
                <a className="navbar-burger">
                    <span/>
                    <span/>
                    <span/>
                </a>
            </div>
        </nav>

        <div className="menu">
            <p className="menu-label">
                General
            </p>
            <ul className="menu-list">
                <li><a>Dashboard</a></li>
                <li><a>Customers</a></li>
            </ul>
        </div>
    </aside>
);