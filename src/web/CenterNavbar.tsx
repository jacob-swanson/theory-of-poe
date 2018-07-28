import * as React from "react";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs, faInfo, faTree} from "@fortawesome/free-solid-svg-icons";
import {observer} from "mobx-react";
import {observable} from "mobx";

@observer
export class CenterNavbar extends React.Component {
    @observable protected navbarActive = false;

    protected toggleNavbar = () => {
        this.navbarActive = !this.navbarActive;
    };

    public render() {
        return (
            <nav className="CenterNavbar navbar is-dark">
                <div className="navbar-brand">
                    <div className={`navbar-burger ${this.navbarActive ? "is-active" : ""}`}
                         onClick={this.toggleNavbar}>
                        <span/>
                        <span/>
                        <span/>
                    </div>
                </div>

                <div className={`navbar-menu ${this.navbarActive ? "is-active" : ""}`}>
                    <div className="navbar-start">
                        <NavLink activeClassName="is-active" to="/passive-skill-tree" className="navbar-item"
                                 href="#">
                            <span className="icon"><FontAwesomeIcon icon={faTree}/></span>
                            <span>Passive Skill Tree</span>
                        </NavLink>
                        <NavLink activeClassName="is-active" to="/gear" className="navbar-item" href="#">
                            <span className="icon"><FontAwesomeIcon icon={faCogs}/></span>
                            <span>Gear</span>
                        </NavLink>
                        <NavLink activeClassName="is-active" to="/details" className="navbar-item" href="#">
                            <span className="icon"><FontAwesomeIcon icon={faInfo}/></span>
                            <span>Details</span>
                        </NavLink>
                    </div>
                </div>

            </nav>
        );
    }
}
