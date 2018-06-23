import { opts as threeThreeZero } from './data/3.3.0';

export type PassiveSkillTreeVersion = '3.3.0'

class PassiveSkillTreeManager {
    protected log = LoggerFactory.forClass(this);
    public getData(version: PassiveSkillTreeVersion = '3.3.0') {
        return threeThreeZero;
    }
}