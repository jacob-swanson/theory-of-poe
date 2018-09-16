import * as React from "react";
import {Component} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import "./Sidebar.css";

export interface SidebarProps {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
}

export class Sidebar extends Component<SidebarProps> {
    public render() {
        const {isSidebarVisible, toggleSidebar} = this.props;

        if (!isSidebarVisible) {
            return null;
        }

        const sidebarToggleButton = (
            <div className="navbar-item">
                <button className="button" onClick={toggleSidebar}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </span>
                </button>
            </div>
        );

        return (
            <aside className="Sidebar menu has-background-light">
                <nav className="navbar is-primary">
                    <div className="navbar-brand">
                        {sidebarToggleButton}
                        <Link className="navbar-item" to="/">
                            Theory of Poe
                        </Link>
                    </div>
                </nav>

                <p className="menu-label">
                    General
                </p>
                <ul className="menu-list">
                    <li><a>Dashboard</a></li>
                    <li><a>Customers</a></li>
                </ul>
                <p className="menu-label">
                    Administration
                </p>
                <ul className="menu-list">
                    <li><a>Team Settings</a></li>
                    <li>
                        <a className="is-active">Manage Your Team</a>
                        <ul>
                            <li><a>Members</a></li>
                            <li><a>Plugins</a></li>
                            <li><a>Add a member</a></li>
                        </ul>
                    </li>
                    <li><a>Invitations</a></li>
                    <li><a>Cloud Storage Environment Settings</a></li>
                    <li><a>Authentication</a></li>
                </ul>
                <p className="menu-label">
                    Transactions
                </p>
                <ul className="menu-list">
                    <li><a>Payments</a></li>
                    <li><a>Transfers</a></li>
                    <li><a>Balance</a></li>
                </ul>
            </aside>
        );
    }
}