#!/usr/bin/env node
import { PassiveSkillTreeDataScraper } from '../passive-skill-tree/PassiveSkillTreeDataScraper';
import 'isomorphic-fetch';

new PassiveSkillTreeDataScraper().scrape();
