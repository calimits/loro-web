import io from 'socket.io-client';
import cache from "../utils/chache-ram"

class SocketIOClient {
    #socket;

    constructor() {
        this.#socket = io('http://localhost:3000');
    }

    connectionEvent() {
        this.#socket.on("connect", ()=>{
            console.log(this.#socket);
            if (cache.has('user-ID')) this.#socket.emit("info", {id: cache.get('user-ID')});
        });
    }

    onMessageEvent() {
        this.#socket.on("onMessage", (data, ack)=> {
            console.log(data);
            ack({error: false, data: [{status: 200}]});
    });
    }

    emmitInfoEvent() {
        this.#socket.emit("info", {id: cache.get('user-ID')});
    }

    listen() {
        this.connectionEvent();
        this.onMessageEvent();
    }
}

export default SocketIOClient;

