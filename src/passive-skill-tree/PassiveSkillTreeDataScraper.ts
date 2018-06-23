import * as prettier from 'prettier';
import * as fs from 'fs';

export class PassiveSkillTreeDataScraper {
    public async scrape() {
        const response = await fetch('https://www.pathofexile.com/passive-skill-tree');
        const body = await response.text();

        const dataRegex = new RegExp('var passiveSkillTreeData = .+?;');
        const dataResult = dataRegex.exec(body);
        if (dataResult === null) {
            throw new Error('Data regex did not return a result');
        }
        const data = dataResult[0];

        const optsRegex = /var opts = [.\s\S]*?;/;
        const optsResult = optsRegex.exec(body);
        if (optsResult === null) {
            throw new Error('Opts regex did not return a result');
        }
        const opts = optsResult[0];

        const versionRegex = /version:\s?'(.*)'/;
        let versionResult = versionRegex.exec(optsResult[0]);
        if (versionResult === null) {
            throw new Error('Version regex did not return a result');
        }
        const version = versionResult[1];

        let javascript = data + '\n' + opts;
        javascript = javascript.replace('var passiveSkillTreeData', 'const passiveSkillTreeData');
        javascript = javascript.replace('var opts', 'export const opts');
        javascript = prettier.format(javascript, {parser: 'typescript'});
        fs.writeFileSync(`./src/passive-skill-tree/data/${version}.ts`, javascript);
    }
}