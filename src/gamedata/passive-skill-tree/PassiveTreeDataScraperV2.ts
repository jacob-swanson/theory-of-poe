import {PassiveSkillTreeRootJson} from "./external-data/PassiveSkillTreeRootJson";
import {PassiveTreeResponse} from "./internal-data/PassiveTreeResponse";
import {GroupResponse} from "./internal-data/GroupResponse";
import {PassiveTreeJson} from "./external-data/PassiveTreeJson";
import {NodeResponse} from "./internal-data/NodeResponse";
import {NodeType} from "../Node";
import {NodeJson} from "./external-data/NodeJson";
import {GroupJson} from "./external-data/GroupJson";
import {ClassArtResponse} from "./internal-data/ClassArtResponse";
import {Dictionary} from "../../utils/Dictionary";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {NodeHttpClient} from "../../utils/http-client/node/NodeHttpClient";
import * as path from "path";
import * as crypto from "crypto";
import {FilesystemUtils} from "../../utils/FilesystemUtils";
import * as fs from "fs";
import * as Url from "url";
import {SkillSpriteJson} from "./external-data/SkillSpritesJson";
import {TexturePackerFrame, TexturePackerJson} from "../../utils/texture-packer/TexturePackerJson";
import {Ascendancy, CharacterClass} from "../Character";

const log = LoggerFactory.getLogger("PassiveSkillTreeDataScraper");

export class PassiveTreeDataScraperV2 {
    private readonly httpClient = new NodeHttpClient();
    private readonly passiveTreeUrl = "https://www.pathofexile.com/passive-skill-tree";

    constructor(private readonly rootDir: string) {
    }

    public async scapeAndDownload(): Promise<void> {
        const externalData = await this.scrapePassiveTreeData();
        const versionDir = path.join(this.rootDir, externalData.version);
        FilesystemUtils.mkdir(versionDir);

        fs.writeFileSync(
            path.join(versionDir, "original.json"),
            JSON.stringify(externalData, null, 4)
        );

        const internalData = await this.convertToInternalFormat(externalData);
        fs.writeFileSync(
            path.join(this.rootDir, internalData.version, "data.json"),
            JSON.stringify(internalData, null, 4)
        );
    }

    /**
     * Scrape JSON data from pathofexile.com.
     *
     * @returns {Promise<PassiveSkillTreeRootJson>}
     */
    private async scrapePassiveTreeData(): Promise<PassiveSkillTreeRootJson> {
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

    private async convertToInternalFormat(passiveTreeRootJson: PassiveSkillTreeRootJson): Promise<PassiveTreeResponse> {

        return {
            version: passiveTreeRootJson.version,
            groups: this.createGroups(passiveTreeRootJson.passiveSkillTreeData),
            classArt: await this.parseClassArt(passiveTreeRootJson.passiveSkillTreeData),
            skillsPerOrbit: passiveTreeRootJson.passiveSkillTreeData.constants.skillsPerOrbit,
            orbitRadii: passiveTreeRootJson.passiveSkillTreeData.constants.orbitRadii,
            assets: await this.parseAssets(passiveTreeRootJson.passiveSkillTreeData),
            skillSprites: await this.parseSpriteSheets(passiveTreeRootJson)
        };
    }

    private async parseClassArt(passiveTreeJson: PassiveTreeJson): Promise<ClassArtResponse[]> {
        const classArts: ClassArtResponse[] = [];
        for (const [id, data] of Object.entries(passiveTreeJson.extraImages)) {
            classArts.push({
                id,
                x: data.x,
                y: data.y,
                url: await this.downloadAsset(`${passiveTreeJson.imageRoot}${data.image}`)
            });
        }
        return classArts;
    }

    private async downloadAsset(downloadUrl: string): Promise<string> {
        const response = await this.httpClient.get(downloadUrl);
        const buffer = await response.buffer();

        const hash = crypto.createHash("sha256");
        hash.update(buffer);
        const digest = hash.digest("hex");

        const urlExtension = path.extname(Url.parse(downloadUrl).pathname!);
        const outDir = path.join(
            this.rootDir,
            "assets",
            `${digest[0]}${digest[1]}`
        );
        FilesystemUtils.mkdirs(outDir);

        const filename = `${digest}${urlExtension}`;
        const outFile = path.join(outDir, filename);
        fs.writeFileSync(outFile, buffer);

        return `/gamedata/assets/${digest[0]}${digest[1]}/${filename}`;
    }

    private createGroups(passiveTreeJson: PassiveTreeJson): GroupResponse[] {
        const groups: GroupResponse[] = [];
        for (const [groupId, groupJson] of Object.entries(passiveTreeJson.groups)) {
            groups.push({
                id: groupId,
                x: groupJson.x * 0.3835,
                y: groupJson.y * 0.3835,
                nodes: this.createNodesInGroup(passiveTreeJson, groupJson)
            });
        }
        return groups;
    }

    private getNodeType(nodeJson: NodeJson): NodeType {
        if (nodeJson.isAscendancyStart) {
            return NodeType.AscendancyStart;
        } else if (nodeJson.spc.length > 0) {
            return NodeType.ClassStart;
        } else if (nodeJson.isJewelSocket) {
            return NodeType.JewelSocket;
        } else if (nodeJson.m) {
            return NodeType.Mastery;
        } else if (nodeJson.ks) {
            return NodeType.Keystone;
        } else if (nodeJson.not) {
            return nodeJson.ascendancyName ? NodeType.AscendancyLarge : NodeType.Notable;
        } else {
            return nodeJson.ascendancyName ? NodeType.AscendancySmall : NodeType.Normal;
        }
    }

    private createNodesInGroup(passiveTreeJson: PassiveTreeJson, groupJson: GroupJson): NodeResponse[] {
        const nodes: NodeResponse[] = [];
        for (const nodeId of groupJson.n) {
            const nodeJson = passiveTreeJson.nodes[nodeId];
            nodes.push({
                id: nodeId.toString(),
                name: nodeJson.dn,
                icon: nodeJson.icon,
                type: this.getNodeType(nodeJson),
                className: this.spcToClass(nodeJson.spc),
                ascendancyName: Ascendancy[nodeJson.ascendancyName],
                description: nodeJson.sd,
                orbit: nodeJson.o,
                orbitIndex: nodeJson.oidx,
                neighbors: nodeJson.out.map(id => id.toString())
            });
        }
        return nodes;
    }

    private spcToClass(spc: number[]): CharacterClass | undefined {
        if (spc.length !== 1) {
            return undefined;
        }

        const spcToClass = [
            CharacterClass.Scion,
            CharacterClass.Marauder,
            CharacterClass.Ranger,
            CharacterClass.Witch,
            CharacterClass.Duelist,
            CharacterClass.Templar,
            CharacterClass.Shadow
        ];

        return spcToClass[spc[0]];
    }

    private async parseAssets(passiveSkillTreeData: PassiveTreeJson): Promise<Dictionary<string>> {
        const assets: Dictionary<string> = {};
        for (const [name, urlByZoomLevel] of  Object.entries(passiveSkillTreeData.assets)) {
            const zoomLevels = Object.keys(urlByZoomLevel).map(zoomLevel => parseFloat(zoomLevel));
            const maxZoomLevel = Math.max(...zoomLevels);
            const url = urlByZoomLevel[maxZoomLevel];
            assets[name] = await this.downloadAsset(url);
        }
        return assets;
    }

    private async parseSpriteSheets(passiveTreeRootData: PassiveSkillTreeRootJson): Promise<Dictionary<string>> {
        const spriteSheets: Dictionary<string> = {};
        for (const [name, spriteSheetJsons] of Object.entries(passiveTreeRootData.passiveSkillTreeData.skillSprites)) {
            const spriteSheetJson = spriteSheetJsons.reverse()[0];
            const texturePackerJson: TexturePackerJson = {
                meta: {
                    image: await this.downloadAsset(`${passiveTreeRootData.passiveSkillTreeData.imageRoot}build-gen/passive-skill-sprite/${spriteSheetJson.filename}`)
                },
                frames: this.parseSpriteSheetFrames(spriteSheetJson)
            };
            spriteSheets[name] = `/gamedata/${passiveTreeRootData.version}/skill-sprites/${name}.json`;
            FilesystemUtils.mkdirs(path.join(this.rootDir, passiveTreeRootData.version, "skill-sprites"));
            fs.writeFileSync(
                path.join(this.rootDir, passiveTreeRootData.version, "skill-sprites", `${name}.json`),
                JSON.stringify(texturePackerJson, null, 4)
            );
        }

        return spriteSheets;
    }

    private parseSpriteSheetFrames(spriteSheetJson: SkillSpriteJson): Dictionary<TexturePackerFrame> {
        const frames: Dictionary<TexturePackerFrame> = {};
        for (const [path, frame] of Object.entries(spriteSheetJson.coords)) {
            frames[path] = {
                frame
            };
        }
        return frames;
    }
}