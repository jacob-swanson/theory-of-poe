import * as React from "react";
import {faStroopwafel} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const LeftSidebar = () => (
    <aside className="App-LeftSidebar has-background-light item is-narrow">
        <nav className="App-Header navbar is-dark">
            <div className="navbar-brand">
                <a className="navbar-item" href="#">
                    <span className="icon">
                        <FontAwesomeIcon icon={faStroopwafel}/>
                    </span>
                    <span>Theory of Poe</span>
                </a>
            </div>
        </nav>

        <div className="sidebar-content">
            <div className="box">
                <form>
                    <div className="field has-addons">
                        <p className="control">
                            <a className="button is-static">
                                Name
                            </a>
                        </p>
                        <div className="control">
                            <input className="input" type="text" placeholder="Character name" defaultValue="Eilthy"/>
                        </div>
                    </div>
                    <div className="field has-addons">
                        <p className="control">
                            <a className="button is-static">
                                Level
                            </a>
                        </p>
                        <div className="control">
                            <input className="input" type="number" defaultValue="93" max={100} min={1}/>
                        </div>
                        <p className="control">
                            <a className="button is-static">
                                108 / 120 (8/8)
                            </a>
                        </p>
                    </div>
                    <div className="field has-addons">
                        <p className="control">
                            <a className="button is-static">
                                Bandit
                            </a>
                        </p>
                        <p className="control">
                            <div className="select">
                                <select>
                                    <option>None</option>
                                    <option>Oak</option>
                                    <option>Alira</option>
                                    <option>Kraityn</option>
                                </select>
                            </div>
                        </p>
                    </div>
                    <div className="field has-addons">
                        <p className="control">
                            <a className="button is-static">
                                Class
                            </a>
                        </p>
                        <p className="control">
                            <div className="select">
                                <select>
                                    <option>Duelist</option>
                                    <option>Marauder</option>
                                    <option>Ranger</option>
                                    <option>Scion</option>
                                    <option>Shadow</option>
                                    <option>Templar</option>
                                    <option>Witch</option>
                                </select>
                            </div>
                        </p>
                        <p className="control">
                            <div className="select">
                                <select>
                                    <option>None</option>
                                    <option>Raider</option>
                                    <option>Deadeye</option>
                                    <option>Pathfinder</option>
                                </select>
                            </div>
                        </p>
                    </div>
                </form>
            </div>

            <table className="table is-fullwidth is-narrow">
                <thead>
                <tr>
                    <th>Damage</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Total DPS</th>
                    <td>123456.1</td>
                </tr>
                <tr>
                    <th>Attack Rate</th>
                    <td>4.5</td>
                </tr>
                <tr>
                    <th>Crit Chance</th>
                    <td>42.50%</td>
                </tr>
                </tbody>

                <tr>
                    <th>Strength</th>
                    <td>195</td>
                </tr>
                <tr>
                    <th>Dexterity</th>
                    <td>304</td>
                </tr>
                <tr>
                    <th>Intelligence</th>
                    <td>132</td>
                </tr>
                <tr/>
                <tr>
                    <th>Maximum Life</th>
                    <td>6220</td>
                </tr>
                <tr>
                    <th>Increased Maximum Life</th>
                    <td>190</td>
                </tr>
                <tr>
                    <th>Life Regen</th>
                    <td>190</td>
                </tr>
            </table>
        </div>
    </aside>
);