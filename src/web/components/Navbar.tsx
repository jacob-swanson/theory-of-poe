import * as React from "react";
import {Component} from "react";
import {Link, NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";

export interface NavbarProps {
    characterId: string;
    isSidebarVisible: boolean;
    toggleSidebar?: () => void;
}

export class Navbar extends Component<NavbarProps> {
    public render() {
        const {characterId, isSidebarVisible, toggleSidebar} = this.props;

        const sidebarToggleButton = (
            <div className="navbar-item">
                <button className="button" onClick={toggleSidebar}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </span>
                </button>
            </div>
        );

        return (
            <nav className="navbar is-primary">
                <div className="navbar-menu">
                    <div className="navbar-start">
                        {!isSidebarVisible ? sidebarToggleButton : null}
                        <NavLink
                            className="navbar-item"
                            to={`/characters/${characterId}/passive-skill-tree`}
                            activeClassName="is-active"
                        >
                            Passive Skill Tree
                        </NavLink>
                        <NavLink
                            className="navbar-item"
                            to={`/characters/${characterId}/gear`}
                            activeClassName="is-active"
                        >
                            Gear
                        </NavLink>
                        <NavLink
                            className="navbar-item"
                            to={`/characters/${characterId}/calculations`}
                            activeClassName="is-active"
                        >
                            Calculations
                        </NavLink>
                    </div>

                    {/*<div className="navbar-end">*/}
                        {/*<div className="navbar-item">*/}
                            {/*<div className="field is-grouped">*/}
                                {/*<p className="control">*/}
                                    {/*<Link className="button is-danger"*/}
                                          {/*to="/characters/new/passive-skill-tree">Reset</Link>*/}
                                {/*</p>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
            </nav>
        );
    }
}
