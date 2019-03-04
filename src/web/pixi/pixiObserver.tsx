import {autorun, IReactionDisposer} from "mobx";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";

const log = LoggerFactory.getLogger("pixiObserver");

type Constructor<T = {}> = new (...args: any[]) => T;

export interface Destroyable {
    destroy(...args: any[]): void;
}

export function pixiObserver<TBase extends Constructor<Destroyable>>(Base: TBase) {
    return class extends Base {
        public dispose: IReactionDisposer;

        constructor(...args: any[]) {
            super(args);
            // setTimeout avoids weird issues with construction
            setTimeout(() => this.dispose = autorun(() => this.react()));
        }

        public destroy(...args: any[]) {
            log.trace("pixiObserver.destroy");
            this.dispose();
            super.destroy(args);
        }

        public react(): void {
            // override this function
        }
    };
}
