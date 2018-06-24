#!/usr/bin/env node
import {PassiveSkillTreeDataScraper} from '../passive-skill-tree/PassiveSkillTreeDataScraper';
import 'isomorphic-fetch';
import {LoggerFactory} from 'js-utils';
import * as Path from "path";
import {CLI, Shim} from "clime";

const cli = new CLI('theory-of-poe', Path.join(__dirname, 'commands'));
const shim = new Shim(cli);
shim.execute(process.argv);