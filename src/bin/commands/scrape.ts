import * as path from "path";
import * as fs from "fs";
import {PassiveSkillTreeDataScraper} from "../../gamedata/passive-skill-tree/PassiveSkillTreeDataScraper";
import {Command, command, param} from "clime";

@command({description: "Scrape passive tree data from pathofexile.com"})
export default class extends Command {
    public async execute(
        @param({
            description: "Directory for downloaded assets",
            required: true
        }) outDir: string
    ): Promise<void> {
        const scraper = new PassiveSkillTreeDataScraper();
        const data = await scraper.scrapePassiveTreeData();
        await scraper.downloadImages(data, path.join(outDir, data.version));
        const dataFile = path.join(outDir, data.version, "data.json");
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    }
}