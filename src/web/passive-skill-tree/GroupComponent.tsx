import * as React from "react";
import {Component} from "react";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {observer} from "mobx-react";
import {Group, GroupBackgroundType} from "../../gamedata/Group";

const log = new ConsoleLogger("Group", "debug");

const ascendancyBackgroundsByAscendancyName = {
    Ascendant: "gamedata/3.3.1/assets/ClassesAscendant-0.3835.png",
    Assassin: "gamedata/3.3.1/assets/ClassesAssassin-0.3835.png",
    Berserker: "gamedata/3.3.1/assets/ClassesBerserker-0.3835.png",
    Champion: "gamedata/3.3.1/assets/ClassesChampion-0.3835.png",
    Chieftain: "gamedata/3.3.1/assets/ClassesChieftain-0.3835.png",
    Deadeye: "gamedata/3.3.1/assets/ClassesDeadeye-0.3835.png",
    Elementalist: "gamedata/3.3.1/assets/ClassesElementalist-0.3835.png",
    Gladiator: "gamedata/3.3.1/assets/ClassesGladiator-0.3835.png",
    Guardian: "gamedata/3.3.1/assets/ClassesGuardian-0.3835.png",
    Hierophant: "gamedata/3.3.1/assets/ClassesHierophant-0.3835.png",
    Inquisitor: "gamedata/3.3.1/assets/ClassesInquisitor-0.3835.png",
    Juggernaut: "gamedata/3.3.1/assets/ClassesJuggernaut-0.3835.png",
    Necromancer: "gamedata/3.3.1/assets/ClassesNecromancer-0.3835.png",
    Occultist: "gamedata/3.3.1/assets/ClassesOccultist-0.3835.png",
    Pathfinder: "gamedata/3.3.1/assets/ClassesPathfinder-0.3835.png",
    Raider: "gamedata/3.3.1/assets/ClassesRaider-0.3835.png",
    Saboteur: "gamedata/3.3.1/assets/ClassesSaboteur-0.3835.png",
    Slayer: "gamedata/3.3.1/assets/ClassesSlayer-0.3835.png",
    Trickster: "gamedata/3.3.1/assets/ClassesTrickster-0.3835.png"
};

export interface GroupProps {
    group: Group
}

@observer
export class GroupComponent extends Component<GroupProps> {
    public render() {
        const {group} = this.props;
        log.trace(`Rendering group ${group.id}`);

        switch (group.getBackgroundType()) {
            case GroupBackgroundType.Ascendancy:
                const url = ascendancyBackgroundsByAscendancyName[group.ascendancyName!];
                if (!group.containsAscendancyStart) {
                    return null;
                }
                return (
                    <pixi-sprite
                        position={group.position}
                        anchor={{x: 0.5, y: 0.5}}
                        url={url}
                    />
                );
            case GroupBackgroundType.Large:
                return (
                    <pixi-container position={group.position}>
                        <pixi-sprite
                            anchor={{x: 0.5, y: 1}}
                            url="gamedata/3.3.1/assets/PSGroupBackground3-0.3835.gif"
                        />
                        <pixi-sprite
                            scale={{x: 1, y: -1}}
                            anchor={{x: 0.5, y: 1}}
                            url="gamedata/3.3.1/assets/PSGroupBackground3-0.3835.gif"
                        />
                    </pixi-container>
                );
            case GroupBackgroundType.Medium:
                return (
                    <pixi-sprite
                        position={group.position}
                        anchor={{x: 0.5, y: 0.5}}
                        url="gamedata/3.3.1/assets/PSGroupBackground2-0.3835.gif"
                    />
                );
            case GroupBackgroundType.Hidden:
                return null;
            case GroupBackgroundType.Small:
                return (
                    <pixi-sprite
                        position={group.position}
                        anchor={{x: 0.5, y: 0.5}}
                        url="gamedata/3.3.1/assets/PSGroupBackground1-0.3835.gif"
                    />
                );
        }
    }
}