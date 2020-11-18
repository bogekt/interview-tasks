import axios from 'axios';
import * as helpers from '../helpers';

const {
    promiseInitializer,
    methodsDecorators: {
        assignFluentMethods,
        assignSetupMethods,
    },
} = helpers;
const fluent = {
    setBaseURL: 'setBaseURL',
    setCorrelationId: 'setCorrelationId',
    addErrorHandling: 'addErrorHandling',
    setHeader: 'setHeader',
};
const setup = {
    [fluent.setBaseURL]: fluent.setBaseURL,
};
const methodsWithoutData = ['delete', 'get', 'head', 'options'];
const methodsWithData = ['post', 'put', 'patch'];
const defaultOptions = {
    axiosInstance: null,
    enrichNotSetupedRequests: null,
    methods: [...methodsWithoutData, ...methodsWithData],
};
const proxy = x => x;
const errorProxy = x => Promise.reject(x);

/**
 * This is class communication by http.
 * It also supports next features:
 * * lazy initiaziation (via [promiseInitializer]{@link promiseInitializer}),
 * * correlation id
 * * error handler
 * !important for appropriate working, don't forget:
 * when you implement new setup axios api also modify enrich.
 * @class HttpClient
 */
export default class HttpClient {
    static fluentMethods = Object.keys(fluent);
    static setupMethods = Object.keys(setup);

    constructor(options = defaultOptions) {
        const {
            axiosInstance,
            methods,
            enrichNotSetupedRequests: enrich,
        } = { ...defaultOptions, ...options };
        const initializer = promiseInitializer(() => this);
        // setup axios
        const instance = axiosInstance || axios.create();
        enrichNotSetupedRequests(instance, initializer.promise, enrich);
        // setup aliases
        methods.forEach(method => (
            this[method] = (...args) => instance[method](...args)
        ));
        // setup decorators
        assignFluentMethods(this, fluent);
        assignSetupMethods(this, setup, { setuped: initializer.resolve });

        this.initializer = initializer;
        this.axios = instance;
    }

    get defaults() { return this.axios.defaults; }

    // todo: implement multiple args passing, like in https://github.com/axios/axios/blob/master/lib/core/Axios.js#L85
    async send(request) {
        return await this.axios.request(request);
    }

    [setup[fluent.setBaseURL]](url) {
        this.defaults.baseURL = url
    }

    [fluent.setCorrelationId](id) {
        const { params = {} } = this.defaults;

        if (params instanceof URLSearchParams) throw new Error('Not supported URLSearchParams now');
        else this.defaults.params = { ...params, correlationId: id };
    }

    [fluent.setHeader](name, value) {
        this.defaults.headers.common[name] = value;
    }

    [fluent.addErrorHandling](errorHandler) {
        this.axios.interceptors.response.use(
            proxy,
            errorHandler,
        );
    }
}

function enrichNotSetupedRequests(axios, setup, externalEnrich) {
    const interceptor = axios.interceptors.request.use(
        async request => {
            await setup;

            axios.interceptors.request.eject(interceptor);
            const enriched = enrich(request, axios.defaults);

            return typeof externalEnrich === 'function'
                ? externalEnrich(enriched)
                : enriched;
        },
        errorProxy,
    );
}

function enrich(request, config) {
    request.baseURL = config.baseURL;
    request.headers.common = {
        ...config.headers.common,
        ...request.headers.common,
    };
    request.params = {
        ...config.params,
        ...request.params,
    }

    return request
}
