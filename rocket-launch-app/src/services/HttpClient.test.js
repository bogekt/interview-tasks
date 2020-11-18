import HttpClient from './HttpClient';

describe('HttpClient', () => {
    test(`constructor with default options works`, () => {
        expect(new HttpClient()).toBeTruthy();
    });

    test(`initialized after calling setBaseURL`, async () => {
        const http = new HttpClient()
        setImmediate(() => http.setBaseURL('http://localhost:3000'))
        await http.initializer.promise
        expect(http.initializer.isInitialized).toBeTruthy();
    });

    // todo: need furthermore for rest API + send/enrich tests with fake server
})
