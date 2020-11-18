/**
 * @module
 */

/**
 * This function decorates instace method, as method with the [fluent interface]{@link https://en.wikipedia.org/wiki/Fluent_interface}.
 * @function fluentMethod
 * @param {Object} options The options for setup method
 * @param {Object} options.instance The instance, which will be binded to {@link options.method}
 * @param {function} options.method The decorated method 
 * @returns {function} The decorator function
 */
export default function fluentMethod({
    instance,
    method,
}) { // eslint-disable-next-line 
    return (...args) => (method.apply(instance, args), instance); 
}