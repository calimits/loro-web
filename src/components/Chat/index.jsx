import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"
import { useEffect, useState } from "react"
import { loroClient } from "../../loro-api-clients/loroClientInstance"
import cache from "../../utils/chache-ram"

export default function Chat({ classNames = "" }) {
    const [messages, setMessages] = useState([]);
    const [start, setStart] = useState(cache.has(`chat-${cache.get("chat-open")}`) ?
        cache.get(`chat-${cache.get("chat-open")}`).start : 0
    );
    const [limit, setLimit] = useState(cache.has(`chat-${cache.get("chat-open")}`) ?
        cache.get(`chat-${cache.get("chat-open")}`).limit : 100
    );

    useEffect(() => {
        async function fetchData() {
            const chatID = cache.get("chat-open");
            const res = await loroClient.getMessages41Chat(chatID, start, limit)
            setStart(start + res.length);
            cache.set(`chat-${cache.get("chat-open")}`, {start, limit})
        }
        fetchData();
    }, [])

    return (
        <div className={`chat ${classNames}`}>
            <ChatHeader />
            <MessageBox messages={messages} setMessages={setMessages} />
            <MessageBar setMessages={setMessages} />
        </div>
    )
}