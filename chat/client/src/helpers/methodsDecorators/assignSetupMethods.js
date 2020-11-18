import initState from './initState';
import setupMethod from './setupMethod';

import { default as createMethodsNames } from './internal/methodsNames';
import assignMethods from './internal/assignMethods';

/**
 * @module
 */
 
/**
 * This function decorates instace group of methods, as methods which setup some state.
 * It use it for each method [setupMethod]{@link module:helpers/methodsDecorators/setupMethod~setupMethod}, so details you can find there.
 * @function assignSetupMethods
 * @param {*} instance The instance, for decorating group of methods and which will be binded to each method.
 * @param {(Object|string[]|function[])} methods
 * The methods of instance. Methods can be:
 * * object, which is names map
 * * array, which elements are strings or methods
 * @param {Object} [options=undefined] The optional options, which would be passed into [setupMethod]{@link module:helpers/methodsDecorators/setupMethod~setupMethod}
 * @returns {*} The same instance object
 */
export default function assignSetupMethods(instance, methods, options) {
    const methodsNames = createMethodsNames(methods);
    const state = instance[Symbol.for(assignSetupMethods.name)] = initState(methodsNames);

    return assignMethods(
        instance, 
        methodsNames,
        (instance, name) => setupMethod({
            ...options,
            state,
            instance,
            method: instance[name],
            name: name,
        }),
    );
}