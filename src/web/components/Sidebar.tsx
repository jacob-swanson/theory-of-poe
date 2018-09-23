import * as React from "react";
import {ChangeEvent, Component} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import "./Sidebar.css";
import {AscendanciesByClass, CharacterClassesBySpc} from "../stores/passive-skill-tree/NodeState";
import {observer} from "mobx-react";
import {CharacterState} from "../stores/passive-skill-tree/CharacterState";

export interface SidebarProps {
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    character: CharacterState;
}

@observer
export class Sidebar extends Component<SidebarProps> {
    private onCharacterClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const {character} = this.props;
        character.setClass(e.target.value as any);
    };
    private onAscendancyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const {character} = this.props;
        character.setAscendancy(e.target.value as any);
    };

    public render() {
        const {isSidebarVisible, toggleSidebar, character} = this.props;

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

                <div className="field has-addons">
                    <p className="control">
                        <span className="select">
                            <select onChange={this.onCharacterClassChange} value={character.className}>
                                {this.renderCharacterClassOptions()}
                            </select>
                        </span>
                    </p>
                    <p className="control">
                        <span className="select">
                            <select onChange={this.onAscendancyChange} value={character.ascendancy}>
                                {this.renderAscendancyOptions()}
                            </select>
                        </span>
                    </p>
                </div>
            </aside>
        );
    }

    private renderCharacterClassOptions() {
        const {character} = this.props;
        const options = [];
        for (const characterClass of CharacterClassesBySpc) {
            options.push(
                <option key={characterClass} value={characterClass}>{characterClass}</option>
            );
        }
        return options;
    }

    private renderAscendancyOptions() {
        const {character} = this.props;
        const options = [];
        for (const ascendancy of AscendanciesByClass[character.className]) {
            options.push(
                <option key={ascendancy} value={ascendancy}>{ascendancy}</option>
            );
        }
        return options;
    }
}