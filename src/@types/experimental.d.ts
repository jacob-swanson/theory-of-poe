type RequestIdleCallbackHandle = any;

interface RequestIdleCallbackOptions {
    timeout: number;
}

interface RequestIdleCallbackDeadline {
    readonly didTimeout: boolean;
    timeRemaining: (() => number);
}

interface Window {
    requestIdleCallback: ((
        callback: ((deadline: RequestIdleCallbackDeadline) => void),
        opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle);
    cancelIdleCallback: ((handle: RequestIdleCallbackHandle) => void);
}

