export default class Launch { 
    constructor(raw) { 
        if (!raw) throw new Error(`Invalid Launch raw: ${raw}`)
        this.raw = { ...raw };
    }

    get id() { return this.raw.id }
    get name() { return this.raw.name }
    get thumbnailURL() { return this.rocket && this.rocket.imageURL }
    get startDate() { return new Date(Date.parse(this.raw.windowstart)) }
    get countryCode() { return this.raw.location && this.raw.location.countryCode }
    get success() { return this.raw.status === 3 }
    get infoURL() { return this.raw.infoURLs && this.raw.infoURLs[0] }
    get rocket() { return this.raw.rocket }
    get missions() { return this.raw.missions }

    showUrl() { 
        if (this.infoURL) return this.infoURL
        if (this.rocket) return this.rocket.wikiURL
        if (this.missions) return this.missions.wikiURL
    }

    toJSON = () => ({ raw: this.raw })
}
