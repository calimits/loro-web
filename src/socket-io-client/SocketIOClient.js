import io from 'socket.io-client';
import cache from "../utils/chache-ram"

class SocketIOClient {
    #socket;

    constructor() {
        this.#socket = io('http://localhost:3000');
    }

    connectionEvent() {
        this.#socket.on("connect", ()=>{
            console.log(this.#socket)
        });
    }

    onMessageEvent() {
        this.#socket.on("onMessage", (data)=>console.log(data));
    }

    emmitInfoEvent() {
        this.#socket.emit("info", {id: cache.get('user-ID')});
    }

    listen() {
        this.connectionEvent();
    }
}

export default SocketIOClient;

