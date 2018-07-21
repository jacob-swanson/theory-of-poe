import * as React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faStroopwafel} from "@fortawesome/free-solid-svg-icons";

export const Header = () => (
    <nav className="App-Header navbar is-dark">
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

        <div className="navbar-end">
            <div className="navbar-item">
                <a className="button is-light" href="#">
                    <span className="icon">
                        <FontAwesomeIcon icon={faGithub}/>
                    </span>
                    <span>GitHub</span>
                </a>
            </div>
        </div>
    </nav>
);