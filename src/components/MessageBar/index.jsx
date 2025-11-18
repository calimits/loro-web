import "./MessageBar.css"
import sendIcon from "../../assets/send-message-icon.png"
import { useState } from "react";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
import { useConversation } from "../ConversationContext";


export default function MessageBar({setMessages}) {
    const [message, setMessage] = useState("");
    const { setUnReadMessages } = useConversation();

    const handleChange = (e) => {
        setMessage( e.target.value);
    }

    const handleSendMessage = async (e) => {
        const date = new Date().toISOString();
        const messageBody = { dateTime: date, chatID: cache.get("chat-open"), content: message };

        try {
            await loroClient.sendTextMessage(messageBody);
            setMessages(messages => [...messages, {...messageBody, emisorUserID: cache.get("user-ID"), type: "text"}]);
            setMessage("");
        } catch (error) {
            setUnReadMessages(unReadMessages => [...unReadMessages, {...messageBody, emisorUserID: cache.get("user-ID"), type: "text"}]);
        }
    }

    return(
        <footer className="message-bar">
            <textarea value={message} onChange={handleChange} className="input-message" type="text" placeholder="Type a message..."></textarea>
            <button className="send-button" onClick={handleSendMessage}>
                <img className="send-message-icon" src={sendIcon}/>
            </button>
        </footer>
    )
}

