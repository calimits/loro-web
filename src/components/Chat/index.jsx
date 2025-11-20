import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"
import { useEffect, useState } from "react"
import { loroClient } from "../../loro-api-clients/loroClientInstance"
import cache from "../../utils/chache-ram"
import { useConversation } from "../ConversationContext"

export default function Chat({ classNames = "" }) {
    const { chatOpenID } = useConversation();

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const chatID = cache.get("chat-open");
            const start = cache.has(`chat-${cache.get("chat-open")}`) ? cache.get(`chat-${cache.get("chat-open")}`).start : 0;
            const limit = 100;
            const res = await loroClient.getMessages41Chat(chatID, start, limit);
            setMessages(res)
            cache.set(`chat-${cache.get("chat-open")}`, { start: start + res.length, limit, messages: [...res] })
        }
        if (!cache.has(`chat-${cache.get("chat-open")}`)) fetchData();
        if (cache.has(`chat-${cache.get("chat-open")}`)) setMessages(cache.get(`chat-${chatOpenID}`).messages);
    }, [chatOpenID])

    return (
        <div className={`chat ${classNames}`}>
            <ChatHeader />
            <MessageBox messages={messages} setMessages={setMessages} />
            <MessageBar setMessages={setMessages} />
        </div>
    )
}