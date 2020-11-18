import fluentMethod from './fluentMethod';

import methodsNames from './internal/methodsNames';
import assignMethods from './internal/assignMethods';

/**
 * @module
 */
 
/**
 * This function decorates instace group of methods, as methods with the [fluent interface]{@link https://en.wikipedia.org/wiki/Fluent_interface}.
 * It use it for each method [fluentMethod]{@link module:helpers/methodsDecorators/fluentMethod~fluentMethod}, so details you can find there.
 * @function assignFluentMethods
 * @param {*} instance The instance, for decorating group of methods and which will be binded to each method.
 * @param {(Object|string[]|function[])} methods
 * The methods of instance. Methods can be:
 * * object, which is names map
 * * array, which elements are strings or methods
 * @param {Object} [options=undefined] The optional options, which would be passed into [fluentMethod]{@link module:helpers/methodsDecorators/fluentMethod~fluentMethod}
 * @returns {*} The same instance object
 */
export default function assignFluentMethods(instance, methods, ...options) {
    return assignMethods(instance, methodsNames(methods), (instance, name) =>
        fluentMethod({
            ...options,
            instance,
            method: instance[name],
        })
    );
}
