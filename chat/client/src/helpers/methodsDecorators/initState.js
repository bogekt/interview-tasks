import methodsNames from './internal/methodsNames';

/**
 * @module
 */

/**
 * Create initial state object, where methods names are keys
 * @function initState
 * @param {(Object|string[]|function[])} methods
 * The methods can be:
 * * object, which is names map
 * * array, which elements are strings or methods
 * @returns {Object} The initial state object
 */
export default function initState(methods) {
    return methodsNames(methods) // eslint-disable-next-line 
        .reduce((acc, val) => (acc[val] = null, acc), {});
}
