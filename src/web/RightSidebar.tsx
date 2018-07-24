import * as React from "react";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const RightSidebar = () => (
    <aside className="App-RightSidebar has-background-light item is-narrow">
        <nav className="App-Header navbar is-dark">
            <div className="navbar-end">
                <div className="navbar-item">
                    <a className="button" href="#">
                    <span className="icon">
                        <FontAwesomeIcon icon={faGithub}/>
                    </span>
                        <span>GitHub</span>
                    </a>
                </div>
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