import Container = PIXI.Container;
import DisplayObject = PIXI.DisplayObject;
import {emptyObject} from "../../utils/emptyObject";
import ReactFiberReconciler = require("react-reconciler");

export interface Props {
    [key: string]: any
}

export interface HostContext {

}

export enum Types {
    Sprite = "Sprite"
}

type RequestIdleCallbackHandle = any;

interface RequestIdleCallbackOptions {
    timeout: number;
}

interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining: (() => number);
}

declare global {
    interface Window {
        requestIdleCallback: ((
            callback: ((deadline: RequestIdleCallbackDeadline) => void),
            opts?: RequestIdleCallbackOptions
        ) => RequestIdleCallbackHandle);
        cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
    }
}

function diffProps(pixiElement: DisplayObject, type: string, lastRawProps: Props, nextRawProps: Props, rootContainerElement: PIXI.Container) {
    let updatePayload: any[] | null = null;

    const lastProps = lastRawProps;
    const nextProps = nextRawProps;
    for (const [propKey] of Object.entries(lastProps)) {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
            continue;
        }
        if (propKey === "children") {
            // Noop. Text children not supported
        } else {
            // For all other deleted properties we add it to the queue. We use
            // the whitelist in the commit phase instead.
            updatePayload = updatePayload || [];
            updatePayload.push(propKey, null);
        }
    }
    for (const [propKey, nextProp] of Object.entries(nextProps)) {
        const lastProp = lastProps != null ? lastProps[propKey] : undefined;
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || (nextProp == null && lastProp == null)) {
            continue;
        }
        if (propKey === "children") {
            // Noop. Text children not supported
        } else {
            // For any other property we always add it to the queue and then we
            // filter it out using the whitelist during the commit.
            updatePayload = updatePayload || [];
            updatePayload.push(propKey, nextProp);
        }
    }
    return updatePayload;
}


function appendChild(parentInstance: PIXI.DisplayObject, child: PIXI.DisplayObject | Text): void {
    if (parentInstance instanceof Container && child instanceof DisplayObject) {
        parentInstance.removeChild(child);
        parentInstance.addChild(child);
    } else {
        throw new Error("not supported");
    }
}

function insertBefore(parentInstance: PIXI.DisplayObject, child: PIXI.DisplayObject | Text, beforeChild: PIXI.DisplayObject | Text) {
    if (parentInstance instanceof Container && child instanceof DisplayObject && beforeChild instanceof DisplayObject) {
        const childExists = parentInstance.children.indexOf(child) !== -1;
        const index = parentInstance.getChildIndex(beforeChild);
        if (childExists) {
            parentInstance.setChildIndex(child, index);
        } else {
            parentInstance.addChildAt(child, index);
        }
    } else {
        throw new Error("not supported");
    }
}

function removeChild(parentInstance: PIXI.DisplayObject, child: PIXI.DisplayObject | Text) {
    if (parentInstance instanceof Container && child instanceof DisplayObject) {
        parentInstance.removeChild(child);
        child.destroy();
    } else {
        throw new Error("not supported");
    }
}


export const ReactPixiRenderer = ReactFiberReconciler<string, // T: component type
    Props, // P: props
    DisplayObject, // I: component instance
    Text, // TI: component text instance
    DisplayObject, // HI: Hydration Instance
    DisplayObject | Text, // PI: Public instance
    Container, // C: Container instance
    any, // Child container instance
    HostContext, // CX: Host context
    Array<[string, any]> // PL: prepare update result
    >({
    createInstance(type: string, props: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext, internalInstanceHandle: {}): PIXI.DisplayObject {
        switch (type) {
            case Types.Sprite:
                return new PIXI.Sprite();
            default:
                throw new Error(`Type ${type} not supported`);
        }
    },
    createTextInstance(text: string, rootContainerInstance: PIXI.Container, hostContext: HostContext, internalInstanceHandle: {}): Text {
        throw new Error("not supported");
    },
    prepareForCommit(): void {
    },
    shouldDeprioritizeSubtree(type: string, props: Props): boolean {
        return false;
    },
    getRootHostContext(rootContainerInstance: PIXI.Container): HostContext {
        return emptyObject;
    },
    useSyncScheduling: true,
    appendInitialChild: appendChild,
    now(): number {
        return 0;
    },
    getChildHostContext(parentHostContext: HostContext, type: string, instance: PIXI.Container): HostContext {
        return emptyObject;
    },
    cancelDeferredCallback: window.cancelIdleCallback,
    scheduleDeferredCallback: window.requestIdleCallback,
    finalizeInitialChildren(parentInstance: PIXI.DisplayObject, type: string, props: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext): boolean {
        return false;
    },
    shouldSetTextContent(type: string, props: Props): boolean {
        return false;
    },
    prepareUpdate(instance: PIXI.DisplayObject, type: string, oldProps: Props, newProps: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext): Array<[string, any]> | null {
        return diffProps(instance, type, oldProps, newProps, rootContainerInstance) || null;
    },
    resetAfterCommit(): void {
    },
    getPublicInstance(instance: PIXI.DisplayObject | Text): PIXI.DisplayObject | Text {
        return instance;
    },
    mutation: {
        appendChild,
        appendChildToContainer: appendChild,
        commitMount(instance: PIXI.DisplayObject, type: string, newProps: Props, internalInstanceHandle: {}): void {
        },
        commitTextUpdate(textInstance: Text, oldText: string, newText: string): void {
        },
        commitUpdate(instance: PIXI.DisplayObject, updatePayload: Array<[string, any]>, type: string, oldProps: Props, newProps: Props, internalInstanceHandle: {}): void {
        },
        insertBefore,
        insertInContainerBefore: insertBefore,
        removeChild,
        removeChildFromContainer: removeChild,
        resetTextContent(instance: PIXI.DisplayObject): void {
        }

    }
});