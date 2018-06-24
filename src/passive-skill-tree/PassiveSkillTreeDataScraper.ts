import * as fs from 'fs';
import { LoggerFactory } from 'js-utils';

export class PassiveSkillTreeDataScraper {
    protected log = LoggerFactory.forClass(this);

    protected readonly passiveTreeUrl = 'https://www.pathofexile.com/passive-skill-tree';

    public async downloadData(): Promise<string> {
        this.log.info(`Scraping "${this.passiveTreeUrl}" for passive skill tree data`);
        const response = await fetch(this.passiveTreeUrl);
        const body = await response.text();

        const dataRegex = new RegExp('var passiveSkillTreeData = .+?;');
        const dataResult = dataRegex.exec(body);
        if (dataResult === null) {
            throw new Error('Data regex did not return a result');
        }
        const dataJs = dataResult[0];

        const optsRegex = /var opts = [.\s\S]*?;/;
        const optsResult = optsRegex.exec(body);
        if (optsResult === null) {
            throw new Error('Opts regex did not return a result');
        }
        let optsJs = optsResult[0];
        optsJs = optsJs.replace('var opts =', 'return');

        let javascript = `(function() {${dataJs} + '\n' + ${optsJs}}())`;
        const data = eval(javascript);

        const version = data.version;
        this.log.info(`Got version "${version}"`);

        const destination = `./src/passive-skill-tree/data/${version}.json`;
        this.log.info(`Writing data to "${destination}"`);
        fs.writeFileSync(destination, JSON.stringify(data));

        return version;
    }

    public async downloadImages(version: string) {
        const module = require('')
    }
}