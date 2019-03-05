import {autorun, IReactionDisposer} from "mobx";
import {LoggerFactory} from "../../utils/logger/LoggerFactory";

const log = LoggerFactory.getLogger("pixiObserver");

type Constructor<T = {}> = new (...args: any[]) => T;

export interface Destroyable {
    destroy(...args: any[]): void;
}

export function pixiObserver<TBase extends Constructor<Destroyable>>(Base: TBase) {
    return class extends Base {
        public _dispose: IReactionDisposer;

        constructor(...args: any[]) {
            super(args);
            // setTimeout avoids issue with calling react() on on the parent when it's not finished constructing.
            setTimeout(() => this._dispose = autorun(() => this.react()));
        }

        public destroy(...args: any[]) {
            log.trace("pixiObserver.destroy");
            this._dispose();
            super.destroy(args);
        }

        public react(): void {
            // override this function
        }
    };
}
