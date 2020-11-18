import Launch from './Launch';

describe('Launch', () => {
    test('constructor without raw throws', () => {
        expect(() => new Launch()).toThrow(/Invalid Launch raw/)
    })
    
    describe('showUrl', () => {
        let raw
        beforeEach(() => raw = {
            infoURLs: [Math.random().toString()],
            rocket: { wikiURL: Math.random().toString() },
            missions: { wikiURL: Math.random().toString() },
        })

        test('return infoURL if defined', () => {
            console.log(raw)
            expect(new Launch(raw).showUrl()).toBe(raw.infoURLs[0])
        })
        test('otherwise return rocket.wikiURL if defined', () => {
            delete raw.infoURLs
            expect(new Launch(raw).showUrl()).toBe(raw.rocket.wikiURL)
        });
        test('otherwise return missions.wikiURL if defined', () => {
            delete raw.infoURLs
            delete raw.rocket
            expect(new Launch(raw).showUrl()).toBe(raw.missions.wikiURL)
        });
        test('otherwise return empty', () => {
            delete raw.infoURLs
            delete raw.rocket
            delete raw.missions
            expect(new Launch(raw).showUrl()).toBe(undefined)
        });
    })

    describe('toJSON', () => {
        test('returns only raw without getters', () => {
            const test = new Launch({ infoURLs: ['test'] })
            const result = test.toJSON()
            expect(Object.keys(result)).toHaveLength(1)
            expect(result.raw).toBeTruthy()
        });
    })

    // TODO
})
