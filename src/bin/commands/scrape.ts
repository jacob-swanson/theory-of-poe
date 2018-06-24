import {Command, command, param} from "clime";
import {PassiveSkillTreeDataScraper} from "../../passive-skill-tree/PassiveSkillTreeDataScraper";
import * as path from "path";
import * as fs from "fs";

@command({description: "Scrape passive tree data from pathofexile.com"})
export default class extends Command {
    async execute(@param({description: "Directory for downloaded assets", required: true}) outDir: string) {
        const scraper = new PassiveSkillTreeDataScraper();
        const data = await scraper.scrapePassiveTreeData();
        await scraper.downloadImages(data, path.join(outDir, data.version));
        const dataFile = path.join(outDir, data.version, "data.json");
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

    }
}