
import assignSetupMethods from './assignSetupMethods';


test(`${assignSetupMethods.name} decorate methods`, () => {
    const testSetupMethods = {
        test1: 'test1',
        test2: 'test2',
    };
    let called = false;
    const setuped = () => called = true;
    const c = new class C {
        [testSetupMethods.test1](x) { return this.x = x + 1 }
        [testSetupMethods.test2](x) { return this.x = x + 2 }
        test3(x) { return this.x = x + 3 }
    };

    assignSetupMethods(c, testSetupMethods, { setuped });

    expect(c.test1(0)).toBe(1);
    expect(c.x).toBe(1);
    expect(called).toBeFalsy();

    expect(c.test3(0)).toBe(3);
    expect(c.x).toBe(3);
    expect(called).toBeFalsy();

    expect(c.test2(0)).toBe(2);
    expect(c.x).toBe(2);
    expect(called).toBeTruthy();
});
