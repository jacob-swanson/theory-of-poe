import * as path from "path";
import "isomorphic-fetch";
import {PassiveTreeDataScraperV2} from "../gamedata/passive-skill-tree/PassiveTreeDataScraperV2";

async function execute(outDir: string): Promise<void> {
    const converter = new PassiveTreeDataScraperV2(outDir);
    await converter.scapeAndDownload();
}

execute(path.join(__dirname, "/../../public/gamedata"));