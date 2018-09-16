import {observable} from "mobx";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";

const log = new ConsoleLogger("UiState");

export class UiState {
    @observable public isSidebarVisible: boolean = true;

    public toggleSidebar = () => {
        if (this.isSidebarVisible) {
            log.debug("Hiding sidebar");
            this.isSidebarVisible = false;
        } else {
            log.debug("Showing sidebar");
            this.isSidebarVisible = true;
        }
    }
}