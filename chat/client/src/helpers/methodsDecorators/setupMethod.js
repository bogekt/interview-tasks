import { default as createMethodName } from "./internal/methodName";

/**
 * @module
 */

function isSetuped(state, key) {
    return typeof state[key] === 'function'
        ? state[key]()
        : state[key]
}

/**
 * Create initial state object, where methods names are keys
 * @param {(Object|string[]|function[])} methods
 * The methods can be:
 * * object, which is names map
 * * array, which elements are strings or methods
 * @returns {Object} The initial state object
 */

/**
 * This callback type is called `setupedCallback` and it is called on end of state setup
 *
 * @callback setupedCallback
 * @param {string} methodName The name of method, which ends state setup
 * @param {...object} args The args, which was passed in ends state setup method
 * @returns {*} Whatever you want.
 */

/**
 * This function decorates instace method, as method which setup some state.
 * The decorator does state setup: 
 * by default it set self method name into state by key, which is method name. 
 * Also it check the end of state setup.
 * On end of state setup it calls [setupedCallback]{@link module:helpers/methodsDecorators/setupMethod~setupedCallback} from {@link options}.
 * The state is considered setuped, when all state keys contains truthy values.
 * @function setupMethod
 * @param {Object} options The options for setup method
 * @param {Object} options.instance The instance, which will be binded to {@link options.method}
 * @param {function} options.method The decorated method, which after executing will setup {@link options.state}
 * @param {setupedCallback} options.setuped The callback, which called on end of {@link options.state} setup.
 * @param {Object} options.state The state, which setups after executing {@link options.method}
 * @param {string} [options.name=method name] The optional name, which when passed overrides {@link options.method} name.
 * @param {*} [options.setupState=method name] The optional state, which will be setuped into options.state after executing {@link options.method}
 * @param {boolean} [options.cachedKeys=true]
 * @returns {function} The decorator function
 */
export default function setupMethod({
    instance,
    method,
    setuped,
    state,
    name = null,
    setupState = null,
    cachedKeys = true,
}) {
    const methodName = name || createMethodName(method);
    const isKeySetuped = isSetuped.bind(null, state);
    let stateKeys = cachedKeys && Object.keys(state);

    return (...args) => {
        const result = method.apply(instance, args);
        state[methodName] = setupState || methodName;

        stateKeys = cachedKeys ? stateKeys : Object.keys(state);
        stateKeys.every(isKeySetuped) && setuped(methodName, ...args);

        return result;
    }
}
