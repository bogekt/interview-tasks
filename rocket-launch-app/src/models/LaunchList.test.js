import LaunchList from './LaunchList';

describe('LaunchList', () => {
    test(`createDefault return LaunchList with empty items`, () => {
        expect(LaunchList.createDefault().items).toHaveLength(0)
    });

    // TODO
})
