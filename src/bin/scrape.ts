import * as path from "path";
import * as fs from "fs";
import {PassiveSkillTreeDataScraper} from "../gamedata/passive-skill-tree/PassiveSkillTreeDataScraper";
import "isomorphic-fetch";

async function execute(outDir: string): Promise<void> {
    const scraper = new PassiveSkillTreeDataScraper();
    const data = await scraper.scrapePassiveTreeData();
    await scraper.downloadImages(data, path.join(outDir, data.version));
    const dataFile = path.join(outDir, data.version, "data.json");
    fs.writeFileSync(dataFile, data);
}

execute(path.join(__dirname, "/../../public/gamedata"));