#!/usr/bin/env node
import { PassiveSkillTreeDataScraper } from '../passive-skill-tree/PassiveSkillTreeDataScraper';
import 'isomorphic-fetch';
import { LoggerFactory } from 'js-utils';

const log = LoggerFactory.byName('theory-of-poe');

try {
    new PassiveSkillTreeDataScraper().downloadData();
} catch (e) {
    log.error(e);
    process.exit(1);
}
