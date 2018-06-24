import { LoggerFactory } from 'js-utils/lib/logger/LoggerFactory';

export type PassiveSkillTreeVersion = '3.3.0'

class PassiveSkillTreeManager {
    protected log = LoggerFactory.forClass(this);

    public getData(version: PassiveSkillTreeVersion = '3.3.0') {
    }
}