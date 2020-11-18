import assignFluentMethods from './assignFluentMethods';


test(`${assignFluentMethods.name} creates fluent api method`, () => {
    const testFluentMethods = {
        test1: 'test1',
        test2: 'test2',
    };
    var c = new class C {
        [testFluentMethods.test1](x) { expect(x).toBe(3); return this.x = x + 1 }
        [testFluentMethods.test2](x) { expect(x).toBe(2); return this.x = x + 2 }
        test3(x) { return this.x = x + 3 }
    };

    assignFluentMethods(c, testFluentMethods);

    expect(c.test1(3).test2(2).test3(1)).toBe(4);
});
