import promiseInitializer from './promiseInitializer';

test(`promiseInitializer without args works`, async () => {
  const initializer = promiseInitializer(() => {});

  expect(initializer.isInitialized).toBe(false);
  setTimeout(() => initializer.resolve(), 500);

  await initializer.promise;
  expect(initializer.isInitialized).toBeTruthy();
});

test(`promiseInitializer with single argument works`, async () => {
  const resolvedArg = 42;
  const initializer = promiseInitializer(x => expect(x).toBe(resolvedArg));

  expect(initializer.isInitialized).toBe(false);
  setTimeout(() => initializer.resolve(resolvedArg), 500);

  await initializer.promise;
  expect(initializer.isInitialized).toBeTruthy();
});

test(`promiseInitializer with initialize + args pass combined args and resolves with result`, async () => {
    const resolvedArgs = [3, 4];
    const args = [3, 4];
    const expectedResult = 'test';
    const initializer = promiseInitializer((w, x, y, z) => (setTimeout(() => {
      expect(w).toBe(args[0]);
      expect(x).toBe(args[1]);
      expect(y).toBe(resolvedArgs[0]);
      expect(z).toBe(resolvedArgs[1]);
    }), expectedResult), args);

    expect(initializer.isInitialized).toBe(false);
    setTimeout(() => initializer.resolve(resolvedArgs), 500);

    const result = await initializer.promise;
    expect(initializer.isInitialized).toBeTruthy();
    expect(result).toBe(expectedResult);
});
