
import initState from './initState';


describe('initState', () => {
    test(`creates inital state from names`, () => {
        expect(initState(['method1', 'method2'])).toMatchObject({
            method1: null,
            method2: null,
        });
    });

    test(`creates inital state from functions`, () => {
        expect(initState([function method1() {}, () => {}])).toMatchObject({
            method1: null,
            '': null,
        });
    });

    test(`creates inital state from hybrid`, () => {
        expect(initState([function method1() {}, 'method2', 3])).toMatchObject({
            method1: null,
            method2: null,
        });
    });
});