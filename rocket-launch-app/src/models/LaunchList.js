import URI from 'urijs'
import Launch from './Launch'

// todo more accurate estimation needed
const MAX_SIZE = 2**7
const PAGE_SIZE = 10
const launchURI = () => new URI('launch')
let favoritesLoaded = false

export default class LaunchList { 
    favoriteIdsSet = {}
    items = []
    date = new Date()
    offset = 0
    filter = ''
    isFavorites = false

    get pageSize() { return PAGE_SIZE }
    get maxSize() { return MAX_SIZE }
    get favoriteIds() { return Object.keys(this.favoriteIdsSet).filter(x => this.favoriteIdsSet[x]) }

    constructor(isFavorites, origin) { 
        this.isFavorites = isFavorites
        origin && (this.favoriteIdsSet = origin.favoriteIdsSet)
        origin && (this.items = origin.items.map(x => new Launch(x.raw)))
    }

    static createDefault = origin => new LaunchList(false, origin)
    static createFavorites = origin => new LaunchList(true, origin)
    static persist = (data) => localStorage.setItem(LaunchList.name, JSON.stringify(data))
    // todo ignore computed (possibly use merge)
    static restore = () => JSON.parse(localStorage.getItem(LaunchList.name) || null)
    // todo
    // static merge(LaunchList, LaunchList): LaunchList

    async loadOlder({ http }) {
        this.offset += this.pageSize
        return await load.bind(this)(http)
    }

    async loadNewer({ http }) {
        this.offset -= this.pageSize
        return await load.bind(this)(http)
    }

    async loadFavorites({ http }) {
        if (!this.favoriteIds.length) return 0

        if (!favoritesLoaded) {
            const cached = new Map(this.items.map(x => ([x.id, x])))
            const toLoad = [...difference(
                this.favoriteIds, 
                new Set(this.items.map(x => x.id)),
            ).values()]
            const loaded = (await Promise.all(
                toLoad.map(x => http.get(buildFavoriteUrl(x)))
            )).map(({ data: { launches } }) => new Launch(launches[0]))
            
            this.items = [
                ...this.favoriteIds.filter(x => cached.has(x)).map(x => x.get(x)),
                ...loaded,
            ]
            favoritesLoaded = true
        }

        return this.items.length
    }

    toggleFavorite = id => {
        this.favoriteIdsSet[id] = !this.favoriteIdsSet[id]
        if (this.favoriteIdsSet[id]) favoritesLoaded = false
    }
}

async function load(http) {
    const { data: { launches } } = await http.get(buildLoadNextUrl.bind(this)())
    if (!launches || !launches.length) return 0

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Cloning_and_merging_Maps
    const map1 = new Map(this.items.map(x => ([x.id, x])))
    const map2 = new Map(launches.map(x => new Launch(x)).map(x => ([x.id, x])))
    this.items = [...new Map([...map1, ...map2]).values()]
    // fire and forget log
    try {
        LaunchList.persist(this)
    } catch (e) {
        console.error(e)
    }

    if (this.items.length > this.maxSize) {
        const shrinkSize = Math.abs(this.items.length - this.maxSize)
        this.items = true // todo detect direction
            ? this.items.slice(shrinkSize)
            : this.items.slice(0, -shrinkSize)
    }

    return launches.length
}
// https://launchlibrary.net/1.4/launch/120
function buildFavoriteUrl(id) {
    return launchURI().search({ mode: 'verbose', id }).toString()
}
// https://launchlibrary.net/1.4/launch?mode=vebose&offset=0&sort=desc&limit=10&enddate=2020-10-11%2016%3A51%3A00
function buildLoadNextUrl() { 
    return launchURI().search({
        mode: 'verbose', 
        offset: this.offset, 
        sort: 'desc', 
        enddate: apiFormatDate(this.date), 
        limit: this.pageSize,
        name: this.filter,
    }).toString()
}

function apiFormatDate(date) {
    return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`
        .concat(' ', `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`)
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations
function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}