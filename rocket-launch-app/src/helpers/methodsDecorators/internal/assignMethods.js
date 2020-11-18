const defaultOptions = {
    enumerable: true,
    configurable: true,
    writable: true,
};

export default function assignMethods(
    instance,
    methodsNames, 
    createValue, 
    options = defaultOptions,
) {
    const mergedOptions = { ...defaultOptions, ...options };

    for (const name of methodsNames)
        Object.defineProperty(instance, name, {
            ...mergedOptions,
            value: createValue(instance, name, mergedOptions)
        });

    return instance;
}
