const asArray = x => Array.isArray(x) ? x : [x];

export default function promiseInitializer(initialize, ...args) {
    let resolver = null;
    let rejecter = null;
    let initialized = false;
    const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
    }).then(resolvedArgs => {
        const result = initialize(...args, ...asArray(resolvedArgs));
        initialized = true;

        return result;
    });

    return {
        get isInitialized() { return initialized; },
        get promise() { return promise; },
        get resolve() { return resolver; },
        get reject() { return rejecter; },
    };
}
