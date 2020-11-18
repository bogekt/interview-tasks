import initState from './initState';
import setupMethod from './setupMethod';

describe('setupMethod', () => {
    test(`define new method`, () => {
        expect(setupMethod({ name: 'test', state: {} })).toBeInstanceOf(
            Function,
        );
    });

    test(`redefined method returs same result`, () => {
        function sum(a, b) {
            return a + b;
        }
        const redefined = setupMethod({
            method: sum,
            state: {},
            setuped: () => {},
        });

        expect(redefined(37, 4)).toBe(sum(37, 4));
        expect(redefined('ab', 'cd')).toBe(sum('ab', 'cd'));
    });

    test(`modifes state appropriatly`, () => {
        const method = function test() {};
        const unchangedKey = 'test2';
        const state = { ...initState([method]), [unchangedKey]: null };

        setupMethod({ method, state, setuped: () => {} })();

        expect(state[unchangedKey]).toBe(null);
        expect(state[method.name]).toBe(method.name);
    });

    test(`calls setuped for setuped state`, () => {
        const method1 = function test1() {};
        const method2 = function test2() {};
        let called = false;
        const setuped = () => (called = true);
        const state = initState([method1, method2]);

        const setupMethod1 = setupMethod({ method: method1, state, setuped });
        const setupMethod2 = setupMethod({ method: method2, state, setuped });

        setupMethod1();
        expect(called).toBeFalsy();

        setupMethod2();
        expect(called).toBeTruthy();
    });
});
