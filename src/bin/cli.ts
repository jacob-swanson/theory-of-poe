#!/usr/bin/env node
import "isomorphic-fetch";
import * as Path from "path";
import {CLI, Shim} from "clime";

(async () => {
    const cli = new CLI("theory-of-poe", Path.join(__dirname, "commands"));
    const shim = new Shim(cli);
    await shim.execute(process.argv);
})();
