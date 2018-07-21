import * as React from "react";
import {faStroopwafel} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const Footer = () => (
    <nav className="App-Footer navbar is-light">
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
);
