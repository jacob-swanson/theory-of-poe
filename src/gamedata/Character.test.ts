import {Character} from "./Character";
import {BaseMaximumLife} from "./stats/life/BaseMaximumLife";
import {MaximumLifePercent} from "./stats/life/MaximumLifePercent";
import {AddedMaximumLife} from "./modifiers/life/AddedMaximumLife";
import {IncreasedMaximumLifePercent} from "./modifiers/life/IncreasedMaximumLifePercent";

it("Character calculates stats", () => {
    const character = new Character();
    character.addModifiers(
        new AddedMaximumLife(100),
        new IncreasedMaximumLifePercent(100)
    );
    const maximumLife = character.calculateStat(BaseMaximumLife, MaximumLifePercent);
    expect(maximumLife).toBe(200);
});
