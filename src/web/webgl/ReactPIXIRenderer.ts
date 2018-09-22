import ReactFiberReconciler = require("react-reconciler");
import {Types} from "./ReactPIXIInternals";
import {emptyObject} from "../../utils/emptyObject";
import {ReactPIXISprite} from "./ReactPIXISprite";
import {ReactPIXIComponent} from "./ReactPIXIComponent";
import {ConsoleLogger} from "../../utils/logger/ConsoleLogger";
import {ReactPIXIContainer} from "./ReactPIXIContainer";
import {ReactPIXILine} from "./ReactPIXILine";
import {ReactPIXIArcTo} from "./ReactPIXIArcTo";
import {ReactPIXIArc} from "./ReactPIXIArc";

const log = new ConsoleLogger("ReactPIXIRenderer", "debug");

interface Props {
    [key: string]: any
}

interface HostContext {

}

function appendChild(parentInstance: PIXI.DisplayObject, child: PIXI.DisplayObject | Text): void {
    log.trace("ReactPIXIRenderer.appendChild", {parentInstance, child});

    if (child instanceof Text) {
        throw new Error("Text not supported");
    }
    if (!(parentInstance instanceof PIXI.Container)) {
        throw new Error("parentInstance not a PIXI.Container");
    }

    parentInstance.addChild(child);
}

function createInstanceFromType(type: Types): PIXI.DisplayObject & ReactPIXIComponent {
    log.trace("ReactPIXIRenderer.createInstanceFromType", {type});

    switch (type) {
        case Types.Sprite:
            return new ReactPIXISprite();
        case Types.Container:
            return new ReactPIXIContainer();
        case Types.Line:
            return new ReactPIXILine();
        case Types.ArcTo:
            return new ReactPIXIArcTo();
        case Types.Arc:
            return new ReactPIXIArc();
        default:
            throw new Error(`Type ${type} not supported`);
    }
}

function createInstance(type: Types, props: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext, internalInstanceHandle: {}): PIXI.DisplayObject {
    log.trace("ReactPIXIRenderer.createInstance", {
        type,
        props,
        rootContainerInstance,
        hostContext,
        internalInstanceHandle
    });

    const instance = createInstanceFromType(type);
    instance.update({}, props);
    return instance;
}

function finalizeInitialChildren(parentInstance: PIXI.DisplayObject, type: Types, props: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext): boolean {
    log.trace("ReactPIXIRenderer.finalizeInitialChildren", {
        parentInstance,
        type,
        props,
        rootContainerInstance,
        hostContext
    });

    return false;
}

function getChildHostContext(parentHostContext: HostContext, type: Types, instance: PIXI.Container): HostContext {
    log.trace("ReactPIXIRenderer.getChildHostContext", {parentHostContext, type, instance});

    return emptyObject;
}

function getPublicInstance(instance: PIXI.DisplayObject | Text): PIXI.DisplayObject {
    log.trace("ReactPIXIRenderer.getPublicInstance", {instance});

    if (instance instanceof Text) {
        throw new Error("Text not supported");
    }

    return instance;
}

function getRootHostContext(rootContainerInstance: PIXI.Container): HostContext {
    log.trace("ReactPIXIRenderer.getRootHostContext", {rootContainerInstance});

    return emptyObject;
}

function diffProps(pixiElement: PIXI.DisplayObject, type: Types, lastRawProps: Props, nextRawProps: Props, rootContainerElement: PIXI.Container): Array<[string, any]> | null {
    log.trace("ReactPIXIRenderer.diffProps", {pixiElement, type, lastRawProps, nextRawProps, rootContainerElement});

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

function prepareUpdate(instance: PIXI.DisplayObject, type: Types, oldProps: Props, newProps: Props, rootContainerInstance: PIXI.Container, hostContext: HostContext): Array<[string, any]> | null {
    log.trace("ReactPIXIRenderer.prepareUpdate", {
        instance,
        type,
        oldProps,
        newProps,
        rootContainerInstance,
        hostContext
    });

    const propsDiff = diffProps(instance, type, oldProps, newProps, rootContainerInstance) || null;

    log.trace("ReactPIXIRenderer.prepareUpdate", {propsDiff});
    return propsDiff;
}

function noop(...args: any[]): any {
    log.trace("ReactPIXIRenderer.noop", [...args]);

}

function shouldDeprioritizeSubtree(type: Types, props: Props): boolean {
    log.trace("ReactPIXIRenderer.shouldDeprioritizeSubtree", {type, props});

    return false;
}

function textNotSupported(...args: any[]): any {
    log.trace("ReactPIXIRenderer.textNotSupported", [...args]);

    throw new Error("Text not supported");
}

function shouldSetTextContent(type: Types, props: Props): boolean {
    log.trace("ReactPIXIRenderer.shouldSetTextContent", {type, props});

    return false;
}

function removeChild(parentInstance: PIXI.DisplayObject, child: PIXI.DisplayObject | Text): void {
    log.trace("ReactPIXIRenderer.removeChild", {parentInstance, child});

    if (child instanceof Text) {
        throw new Error("Text not supported");
    }
    if (!(parentInstance instanceof PIXI.Container)) {
        throw new Error("parentInstance not a PIXI.Container");
    }

    parentInstance.removeChild(child);
    child.destroy();
}

function isComponentUpdatable(instance: any): instance is ReactPIXIComponent {
    log.trace("ReactPIXIRenderer.isComponentUpdatable", {instance});

    return typeof instance.update === "function";
}

function commitUpdate(
    instance: PIXI.DisplayObject,
    updatePayload: Array<[string, any]>,
    type: Types,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: {}
): void {
    log.trace("ReactPIXIRenderer.commitUpdate", {
        instance,
        updatePayload,
        type,
        oldProps,
        newProps,
        internalInstanceHandle
    });

    if (!isComponentUpdatable(instance)) {
        log.warn("Component was not updateable", {instance});
        return;
    }
    instance.update(oldProps, newProps);
}

export const ReactPIXIRenderer = ReactFiberReconciler<Types, // T
    Props, // P
    PIXI.DisplayObject, // I
    Text, // TI
    PIXI.DisplayObject, // HI
    PIXI.DisplayObject, // PI
    PIXI.Container, // C
    any, // CC
    HostContext, // CX
    Array<[string, any]> // PL
    >({
    isPrimaryRenderer: false,
    supportsHydration: false,
    supportsMutation: true,
    supportsPersistence: false,
    appendInitialChild: appendChild,
    cancelDeferredCallback: window.cancelIdleCallback,
    createInstance,
    createTextInstance: textNotSupported,
    finalizeInitialChildren,
    getChildHostContext,
    getPublicInstance,
    getRootHostContext,
    now: Date.now,
    prepareForCommit: noop,
    prepareUpdate,
    resetAfterCommit: noop,
    scheduleDeferredCallback: window.requestIdleCallback,
    shouldDeprioritizeSubtree,
    shouldSetTextContent,
    appendChild,
    appendChildToContainer: appendChild,
    commitMount: noop,
    commitTextUpdate: textNotSupported,
    commitUpdate,
    insertBefore: appendChild,
    insertInContainerBefore: appendChild,
    removeChild,
    removeChildFromContainer: removeChild,
    resetTextContent: textNotSupported
});