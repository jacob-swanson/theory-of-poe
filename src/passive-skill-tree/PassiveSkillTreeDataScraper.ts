import * as fs from "fs";
import { FilesystemUtils, JsonObject, LoggerFactory } from "js-utils";
import * as path from "path";
import * as Url from "url";

export class PassiveSkillTreeDataScraper {
    protected log = LoggerFactory.forClass(this);

    protected readonly passiveTreeUrl = "https://www.pathofexile.com/passive-skill-tree";

    public async scrapePassiveTreeData(): Promise<JsonObject> {
        this.log.info(`Scraping "${this.passiveTreeUrl}" for passive skill tree data`);
        const response = await fetch(this.passiveTreeUrl);
        const body = await response.text();

        const dataRegex = new RegExp("var passiveSkillTreeData = .+?;");
        const dataResult = dataRegex.exec(body);
        if (dataResult === null) {
            throw new Error("Data regex did not return a result");
        }
        const dataJs = dataResult[0];

        const optsRegex = /var opts = [.\s\S]*?;/;
        const optsResult = optsRegex.exec(body);
        if (optsResult === null) {
            throw new Error("Opts regex did not return a result");
        }
        let optsJs = optsResult[0];
        optsJs = optsJs.replace("var opts =", "return");

        const javascript = `(function() {${dataJs}\n${optsJs}}())`;
        // tslint:disable-next-line
        const data = eval(javascript);

        const version = data.version;
        this.log.info(`Got version "${version}"`);

        return data;
    }

    public writeData(data: JsonObject) {
        const destination = `./src/passive-skill-tree/data/${data.version}.json`;
        this.log.info(`Writing data to "${destination}"`);
        fs.writeFileSync(destination, JSON.stringify(data, null, 2));
    }

    protected async download(url: string, dest: string) {
        if (fs.existsSync(dest)) {
            this.log.debug(`Skipping ${dest}`);
            return;
        }

        this.log.info(`Downloading: ${url}`);
        const response = await httpClient.get(url);
        const file = fs.createWriteStream(dest);
        await response.pipe(file);
        file.close();
    }

    public async downloadImages(json: JsonObject, outDir: string) {
        FilesystemUtils.mkdir(outDir);

        FilesystemUtils.mkdir(`${outDir}/assets`);
        for (const [assetKey, asset] of Object.entries(json.assets)) {
            for (const [zoomLevel, url] of Object.entries(asset)) {
                const extension = path.extname(url);
                const filename = `assets/${assetKey}-${zoomLevel}${extension}`;
                const dest = `${outDir}/${filename}`;
                await download(url, dest);
                json.assets[assetKey][zoomLevel] = filename;
            }
        }

        const imageRoot = json.imageRoot;
        FilesystemUtils.mkdir(`${outDir}/skillSprites`);
        for (const [skillSpriteGroupName, skillSpriteGroup] of _.entries(json.skillSprites)) {
            let i = 0;
            for (const skillSprite of skillSpriteGroup) {
                const url = `${imageRoot}build-gen/passive-skill-sprite/${skillSprite.filename}`;
                const pathname = Url.parse(url).pathname;
                if (!pathname) {
                    throw new Error("No pathname");
                }
                const basename = path.basename(pathname);
                const filename = `skillSprites/${basename}`;
                const dest = `${outDir}/${filename}`;
                await this.download(url, dest);
                json.skillSprites[skillSpriteGroupName][i].filename = filename;
                i++;
            }
        }

        FilesystemUtils.mkdir(`${outDir}/extraImages`);
        for (const [key, data] of _.entries(json.extraImages)) {
            const url = `${imageRoot}${data.image}`;
            const pathname = path.basename(data.image);
            const filename = `extraImages/${pathname}`;
            const dest = `${outDir}/${filename}`;
            await this.download(url, dest);
            json.extraImages[key].image = filename;
        }

        return json;
    }
}
