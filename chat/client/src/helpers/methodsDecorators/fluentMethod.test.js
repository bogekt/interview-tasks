import fluentMethod from './fluentMethod';


test(`fluentMethod creates fluent api method`, () => {
    const instance = new class C {
        method2() { return 2 }
        method(val) { expect(val).toBe(42); return 1; }
    };

    instance.method = fluentMethod({
        instance,
        method: instance.method 
    });

    expect(instance.method(42).method2()).toBe(2);
});
