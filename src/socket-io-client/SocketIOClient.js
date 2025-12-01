import io from 'socket.io-client';
import cache from "../utils/chache-ram"

class SocketIOClient {
    #socket;

    constructor() {
        this.#socket = io('http://localhost:3000');
    }

    emit(event, data) {
        this.#socket.emit(event, data);
    }

    connectionEvent() {
        this.#socket.on("connect", ()=>{
            if (cache.has('user-ID')) this.#socket.emit("info", {id: cache.get('user-ID')});
        });
    }

    onMessageEvent(callback) {
        this.#socket.on("onMessage", callback);
    }

    onMessagesStatusUpdateEvent(callback) {
        this.#socket.on("onMessageStatusUpdate", callback);
    }

    onChatCreationEvent(callback) {
        this.#socket.on("onChatCreation", callback);
    }

    onMessageDeleteEvent(callback) {
        this.#socket.on("onMessageDelete", callback);
    }

    emmitInfoEvent() {
        this.#socket.emit("info", {id: cache.get('user-ID')});
    }

}

export default SocketIOClient;

