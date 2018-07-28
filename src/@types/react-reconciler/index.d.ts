declare namespace ReactReconciler {
    export type Fiber = any;

    export type FiberRoot = any;

    export interface OpaqueHandle {
    }

    export type OpaqueRoot = FiberRoot;

    export type ExpirationTime = number;

    export type ReactEmpty = null | void | boolean;

    export  type ReactNodeList = ReactEmpty | React.ReactNode;
    export  type BundleType = 0 | 1;

    export interface DevToolsConfig<I, TI> {
        bundleType: BundleType,
        version: string,
        rendererPackageName: string,
        findFiberByHostInstance?: (instance: I | TI) => Fiber,
        getInspectorDataForViewTag?: (tag: number) => Object,
    }


    export interface Reconciler<C, I, TI> {
        createContainer(
            containerInfo: C,
            isAsync: boolean,
            hydrate: boolean
        ): OpaqueRoot,

        updateContainer(
            element: ReactNodeList,
            container: OpaqueRoot,
            parentComponent: React.Component<any, any> | null,
            callback?: Function
        ): ExpirationTime,

        updateContainerAtExpirationTime(
            element: ReactNodeList,
            container: OpaqueRoot,
            parentComponent: React.Component<any, any> | null,
            expirationTime: ExpirationTime,
            callback?: Function
        ): ExpirationTime,

        flushRoot(root: OpaqueRoot, expirationTime: ExpirationTime): void,

        requestWork(root: OpaqueRoot, expirationTime: ExpirationTime): void,

        batchedUpdates<A>(fn: () => A): A,

        unbatchedUpdates<A>(fn: () => A): A,

        flushSync<A>(fn: () => A): A,

        deferredUpdates<A>(fn: () => A): A,

        injectIntoDevTools(devToolsConfig: DevToolsConfig<I, TI>): boolean,

        computeUniqueAsyncExpiration(): ExpirationTime,

        // Used to extract the return value from the initial render. Legacy API.
        getPublicRootInstance(
            container: OpaqueRoot
        ): React.Component<any, any> | TI | I | null,

        // Use for findDOMNode/findHostNode. Legacy API.
        findHostInstance(component: Fiber): I | TI | null,

        // Used internally for filtering out portals. Legacy API.
        findHostInstanceWithNoPortals(component: Fiber): I | TI | null,
    }

    export interface HydrationHostConfig<T, P, I, TI, HI, C, CX, PL> {
        // Optional hydration
        canHydrateInstance(instance: HI, type: T, props: P): null | I,

        canHydrateTextInstance(instance: HI, text: string): null | TI,

        getNextHydratableSibling(instance: I | TI | HI): null | HI,

        getFirstHydratableChild(parentInstance: I | C): null | HI,

        hydrateInstance(
            instance: I,
            type: T,
            props: P,
            rootContainerInstance: C,
            hostContext: CX,
            internalInstanceHandle: OpaqueHandle
        ): null | PL,

        hydrateTextInstance(
            textInstance: TI,
            text: string,
            internalInstanceHandle: OpaqueHandle
        ): boolean,

        didNotMatchHydratedContainerTextInstance(
            parentContainer: C,
            textInstance: TI,
            text: string
        ): void,

        didNotMatchHydratedTextInstance(
            parentType: T,
            parentProps: P,
            parentInstance: I,
            textInstance: TI,
            text: string
        ): void,

        didNotHydrateContainerInstance(parentContainer: C, instance: I | TI): void,

        didNotHydrateInstance(
            parentType: T,
            parentProps: P,
            parentInstance: I,
            instance: I | TI
        ): void,

        didNotFindHydratableContainerInstance(
            parentContainer: C,
            type: T,
            props: P
        ): void,

        didNotFindHydratableContainerTextInstance(
            parentContainer: C,
            text: string
        ): void,

        didNotFindHydratableInstance(
            parentType: T,
            parentProps: P,
            parentInstance: I,
            type: T,
            props: P
        ): void,

        didNotFindHydratableTextInstance(
            parentType: T,
            parentProps: P,
            parentInstance: I,
            text: string
        ): void,
    }

    export interface MutableUpdatesHostConfig<T, P, I, TI, C, PL> {
        commitUpdate(
            instance: I,
            updatePayload: PL,
            type: T,
            oldProps: P,
            newProps: P,
            internalInstanceHandle: {}
        ): void,

        commitMount(
            instance: I,
            type: T,
            newProps: P,
            internalInstanceHandle: {}
        ): void,

        commitTextUpdate(textInstance: TI, oldText: string, newText: string): void,

        resetTextContent(instance: I): void,

        appendChild(parentInstance: I, child: I | TI): void,

        appendChildToContainer(container: C, child: I | TI): void,

        insertBefore(parentInstance: I, child: I | TI, beforeChild: I | TI): void,

        insertInContainerBefore(
            container: C,
            child: I | TI,
            beforeChild: I | TI
        ): void,

        removeChild(parentInstance: I, child: I | TI): void,

        removeChildFromContainer(container: C, child: I | TI): void,
    }

    export interface PersistentUpdatesHostConfig<T, P, I, TI, C, CC, PL> {
        cloneInstance(
            instance: I,
            updatePayload: null | PL,
            type: T,
            oldProps: P,
            newProps: P,
            internalInstanceHandle: OpaqueHandle,
            keepChildren: boolean,
            recyclableInstance: I
        ): I,

        createContainerChildSet(container: C): CC,

        appendChildToContainerChildSet(childSet: CC, child: I | TI): void,

        finalizeContainerChildren(container: C, newChildren: CC): void,

        replaceContainerChildren(container: C, newChildren: CC): void,
    }

    export interface HostConfig<T, P, I, TI, HI, PI, C, CC, CX, PL> {
        useSyncScheduling?: boolean,
        hydration?: HydrationHostConfig<T, P, I, TI, HI, C, CX, PL>,
        mutation?: MutableUpdatesHostConfig<T, P, I, TI, C, PL>,
        persistence?: PersistentUpdatesHostConfig<T, P, I, TI, C, CC, PL>,

        getRootHostContext(rootContainerInstance: C): CX,

        getChildHostContext(parentHostContext: CX, type: T, instance: C): CX,

        getPublicInstance(instance: I | TI): PI,

        createInstance(
            type: T,
            props: P,
            rootContainerInstance: C,
            hostContext: CX,
            internalInstanceHandle: {}
        ): I,

        appendInitialChild(parentInstance: I, child: I | TI): void,

        finalizeInitialChildren(
            parentInstance: I,
            type: T,
            props: P,
            rootContainerInstance: C,
            hostContext: CX
        ): boolean,

        prepareUpdate(
            instance: I,
            type: T,
            oldProps: P,
            newProps: P,
            rootContainerInstance: C,
            hostContext: CX
        ): null | PL,

        shouldSetTextContent(type: T, props: P): boolean,

        shouldDeprioritizeSubtree(type: T, props: P): boolean,

        createTextInstance(
            text: string,
            rootContainerInstance: C,
            hostContext: CX,
            internalInstanceHandle: {}
        ): TI,

        scheduleDeferredCallback(
            callback: (deadline: { timeRemaining: () => number }) => void,
            options?: { timeout: number }
        ): number,

        cancelDeferredCallback(callbackID: number): void,

        prepareForCommit(): void,

        resetAfterCommit(): void,

        now(): number,
    }
}

declare module "react-reconciler" {
    function ReactFiberReconciler<T, P, I, TI, HI, PI, C, CC, CX, PL>(hostConfig: ReactReconciler.HostConfig<T, P, I, TI, HI, PI, C, CC, CX, PL>): ReactReconciler.Reconciler<C, I, TI>
    export = ReactFiberReconciler;
}
