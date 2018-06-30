import {LoggerFactory} from "@jacob-swanson/js-utils/lib/logger/LoggerFactory";

export type PassiveSkillTreeVersion = "3.3.0";

class PassiveSkillTreeManager {
    protected log = LoggerFactory.getLogger(this);

    public getData(version: PassiveSkillTreeVersion = "3.3.0"): void {
    }
}