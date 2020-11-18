import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'

let connection
const channel = {
    async connect(url) {
        connection = new HubConnectionBuilder()
            .withUrl(url)
            .configureLogging(LogLevel.Information)
            .build();
        await connection.start()

        return channel
    },
    subscribe(callback) {
        connection.on("ReceiveMessage", callback)

        return channel
    },
    async send(...args) {
        await connection.invoke("SendMessage", ...args)

        return channel
    }
}

export default channel