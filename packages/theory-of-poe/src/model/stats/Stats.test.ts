import {StrengthAttribute} from "./StrengthAttribute";
import {Character} from "../Character";
import {AddStrengthMod} from "./attributes/AddStrengthMod";
import {IncreaseStrengthMod} from "./attributes/IncreaseStrengthMod";
import {MoreStrengthMod} from "./attributes/MoreStrengthMod";
import {ReducedStrengthStat} from "./attributes/ReducedStrengthStat";
import {ModParser} from "./ModParser";


it("Stats", () => {
    const character = new Character();
    character.stats.push(
        new AddStrengthMod(10),
        new IncreaseStrengthMod(50),
        new IncreaseStrengthMod(50),
        new ReducedStrengthStat(50),
        new MoreStrengthMod(100)
    );
    const strengthAttribute = new StrengthAttribute(character);
    expect(strengthAttribute.value).toBe(30);
});