import {PassiveSkillTreeVersion} from "./PassiveSkillTreeVersion";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";
import {HttpClient} from "../../utils/http-client/HttpClient";
import {PassiveSkillTreeRootJson} from "./external-data/PassiveSkillTreeRootJson";
import {PassiveTreeResponse} from "./internal-data/PassiveTreeResponse";

const log = LoggerFactory.getLogger("PassiveSkillTreeService");

export interface PassiveSkillTreeUrls {
    data: string;
    images: string;
}

export class PassiveSkillTreeService {
    constructor(protected rootUrl: string, protected httpClient: HttpClient) {
    }

    /**
     * Get list of passive tree versions.
     */
    public async getVersions(): Promise<PassiveSkillTreeVersion[]> {
        return [
            {version: "3.4.5"}
        ];
    }

    /**
     * Get the json data for a passive tree version.
     *
     * @param version
     */
    public async getDataForVersion(version: PassiveSkillTreeVersion): Promise<PassiveTreeResponse> {
        log.debug(`Fetching data for version ${version.version}`);
        const urls = this.getUrls(version);
        const response = await this.httpClient.get(urls.data);
        return await response.json<PassiveTreeResponse>();
    }

    /**
     * Get the URLs used to download data.
     *
     * @param version
     */
    protected getUrls(version: PassiveSkillTreeVersion): PassiveSkillTreeUrls {
        return {
            data: `${this.rootUrl}/${version.version}/data.json`,
            images: `${this.rootUrl}/${version.version}/images`
        };
    }
}