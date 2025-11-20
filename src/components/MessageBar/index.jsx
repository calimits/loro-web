import "./MessageBar.css"
import sendIcon from "../../assets/send-message-icon.png"
import { useState } from "react";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
import { useConversation } from "../ConversationContext";


export default function MessageBar({ setMessages }) {
    const [message, setMessage] = useState("");
    const { setUnReadMessages } = useConversation();

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleSendMessage = async (e) => {
        if (message.length === 0) return;

        const date = new Date().toISOString();
        const messageBody = { dateTime: date, chatID: cache.get("chat-open"), content: message };
        const chatOpen = cache.get("chat-open");
        const emisorUserID = cache.get("user-ID");
        const chatMembers = cache.get("chats").chats.find(chat => chat._id === chatOpen).chatUsers;
        const messageReceptors = chatMembers.filter(member => member.userID !== emisorUserID);
        const messageStatusVerification = [];
        messageReceptors.forEach(receptor => {
            messageStatusVerification.push({
                receptorUserID: receptor.userID,
                isRecieved: false,
                isRead: false,
            })
        });

        try {
            await loroClient.sendTextMessage(messageBody);
            setMessages(messages => [...messages, { ...messageBody, emisorUserID: cache.get("user-ID"), type: "text", messageVerificationStatus: messageStatusVerification }]);
            const cachedMessages = cache.get(`chat-${cache.get("chat-open")}`).messages;
            cache.set(`chat-${cache.get("chat-open")}`, {
                ...cache.get(`chat-${cache.get("chat-open")}`),
                messages: [...cachedMessages, { ...messageBody, emisorUserID: cache.get("user-ID"), type: "text", messageVerificationStatus: messageStatusVerification }]
            });
            setMessage("");
        } catch (error) {
            setUnReadMessages(unReadMessages => [...unReadMessages, { ...messageBody, emisorUserID: cache.get("user-ID"), type: "text", messageVerificationStatus: messageStatusVerification }]);
        }
    }

    return (
        <footer className="message-bar">
            <textarea value={message} onChange={handleChange} className="input-message" type="text" placeholder="Type a message..."></textarea>
            <button className="send-button" onClick={handleSendMessage}>
                <img className="send-message-icon" src={sendIcon} />
            </button>
        </footer>
    )
}

