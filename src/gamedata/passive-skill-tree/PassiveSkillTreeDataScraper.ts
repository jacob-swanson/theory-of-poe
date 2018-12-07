import * as fs from "fs";
import * as path from "path";
import * as Url from "url";
import * as _ from "lodash";
import {PassiveSkillTreeRootJson} from "./external-data/PassiveSkillTreeRootJson";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {NodeHttpClient} from "../../utils/http-client/node/NodeHttpClient";
import {FilesystemUtils} from "../../utils/FilesystemUtils";

const log = LoggerFactory.getLogger("PassiveSkillTreeDataScraper");

export class PassiveSkillTreeDataScraper {
    protected readonly httpClient = new NodeHttpClient();
    protected readonly passiveTreeUrl = "https://www.pathofexile.com/passive-skill-tree";

    /**
     * Scrape JSON data from pathofexile.com.
     *
     * @returns {Promise<PassiveSkillTreeRootJson>}
     */
    public async scrapePassiveTreeData(): Promise<PassiveSkillTreeRootJson> {
        log.info(`Scraping "${this.passiveTreeUrl}" for passive skill tree data`);
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
        // tslint:disable-children-line
        const data = eval(javascript);

        const version = data.version;
        log.info(`Got version "${version}"`);

        return data;
    }

    /**
     * Download image assets and modify the URLs.
     *
     * @param {PassiveSkillTreeRootJson} json
     * @param {string} outDir
     * @returns {Promise<PassiveSkillTreeRootJson>}
     */
    public async downloadImages(
        json: PassiveSkillTreeRootJson,
        outDir: string
    ): Promise<PassiveSkillTreeRootJson> {
        FilesystemUtils.mkdir(outDir);

        FilesystemUtils.mkdir(`${outDir}/assets`);
        for (const [assetKey, asset] of _.entries(json.passiveSkillTreeData.assets)) {
            for (const [zoomLevel, url] of _.entries(asset)) {
                const extension = path.extname(url);
                const filename = `assets/${assetKey}-${zoomLevel}${extension}`;
                const dest = `${outDir}/${filename}`;
                await this.download(url, dest);
                json.passiveSkillTreeData.assets[assetKey][zoomLevel] = filename;
            }
        }

        const imageRoot = json.passiveSkillTreeData.imageRoot;
        FilesystemUtils.mkdir(`${outDir}/skillSprites`);

        for (const [skillSpriteGroupName, skillSpriteGroup] of Object.entries(json.passiveSkillTreeData.skillSprites)) {
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
                json.passiveSkillTreeData.skillSprites[skillSpriteGroupName][i].filename = filename;
                i++;
            }
        }

        FilesystemUtils.mkdir(`${outDir}/extraImages`);
        for (const [key, data] of Object.entries(json.passiveSkillTreeData.extraImages)) {
            const url = `${imageRoot}${data.image}`;
            const pathname = path.basename(data.image);
            const filename = `extraImages/${pathname}`;
            const dest = `${outDir}/${filename}`;
            await this.download(url, dest);
            json.passiveSkillTreeData.extraImages[key].image = filename;
        }

        return json;
    }

    /**
     * Download a file.
     *
     * @param {string} url
     * @param {string} dest
     * @returns {Promise<void>}
     */
    protected async download(url: string, dest: string): Promise<void> {
        if (fs.existsSync(dest)) {
            log.debug(`Skipping ${dest}`);
            return;
        }

        log.info(`Downloading: ${url}`);
        const response = await this.httpClient.get(url);
        const file = fs.createWriteStream(dest);
        await response.pipe(file);
        file.close();
    }
}
