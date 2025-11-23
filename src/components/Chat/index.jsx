import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"
import { useEffect, useState } from "react"
import { loroClient } from "../../loro-api-clients/loroClientInstance"
import cache from "../../utils/chache-ram"
import { useConversation } from "../ConversationContext"

export default function Chat({ classNames = "" }) {
    const { chatOpenID, unRecievedMessages, setUnRecievedMessages } = useConversation();

    const [messages, setMessages] = useState([]);
    const [deleteMsg, setDeleteMsg] = useState(false);
    const [selectedMsgs, setSelectedMsgs] = useState([]);

    const messageStates = {messages, setMessages, deleteMsg, setDeleteMsg, selectedMsgs, setSelectedMsgs};

    useEffect(() => {
        async function fetchData() {
            const chatID = cache.get("chat-open");
            const start = cache.has(`chat-${cache.get("chat-open")}`) ? cache.get(`chat-${cache.get("chat-open")}`).start : 0;
            const limit = 100;
            const res = await loroClient.getMessages41Chat(chatID, start, limit);
            //const res = await loroClient.getAllUnrecievedMessages41User();
            setMessages(res)
            cache.set(`chat-${cache.get("chat-open")}`, { start: start + res.length, limit, messages: [...res] })
        }
        if (!cache.has(`chat-${cache.get("chat-open")}`)) fetchData();
        if (cache.has(`chat-${cache.get("chat-open")}`)) setMessages(cache.get(`chat-${chatOpenID}`).messages);
    }, [chatOpenID])

    const updateMsgs = () => {
        console.log(unRecievedMessages)
        messageStates.setMessages(msgs => [...msgs, ...unRecievedMessages.get(chatOpenID)]);
        cache.set(`chat-${chatOpenID}`, {...cache.get(`chat-${chatOpenID}`), messages: [...cache.get(`chat-${chatOpenID}`).messages, ...unRecievedMessages.get(chatOpenID)]});
        setUnRecievedMessages(prevMsgs => {
            const newMsgs = new Map(prevMsgs);
            newMsgs.delete(chatOpenID);
            return newMsgs;
        });
    }

    useEffect(()=>{
        if (unRecievedMessages.has(chatOpenID)) {
            updateMsgs();
        }
    }, [unRecievedMessages]);


    return (
        <div className={`chat ${classNames}`}>
            <ChatHeader messageStates={messageStates}/>
            <MessageBox messageStates={messageStates}/>
            <MessageBar setMessages={setMessages} />
        </div>
    )
}