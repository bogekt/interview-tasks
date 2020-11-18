import HttpClient from './HttpClient'

const api = {
    http: null,
    initialize({ serverRoot }) { 
        api.http = new HttpClient()
            .setBaseURL(serverRoot)
            .addErrorHandling(err => console.error(err))
            .setHeader('Content-Type', 'application/json')
    },
    async bootstrapData(url) {
        return await (await fetch(url || 'bootstrap.json')).json()
    },
    async login(user) {
        const { data: result } = await api.http.post('api/login', user)

        return result
    },
    async config() {
        const { data } = await api.http.get('api/config')

        return data
    }
}

export default api