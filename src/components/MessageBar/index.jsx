import "./MessageBar.css"
import sendIcon from "../../assets/send-message-icon.png"
import { useState } from "react";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
import { useConversation } from "../ConversationContext";


export default function MessageBar({ setMessages }) {
    const [message, setMessage] = useState("");
    const { setUnsentMessages } = useConversation();

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const buildMessage = () => {
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

        const tempMessage = {
            ...messageBody,
            emisorUserID,
            type: "text",
            messageVerificationStatus: messageStatusVerification,
            unSent: true
        };

        return { tempMessage, messageBody, emisorUserID, messageStatusVerification };
    }

    const handleSendMessage = async (e) => {
        if (message.length === 0) return;

        const { tempMessage, messageBody, emisorUserID, messageStatusVerification } = buildMessage();
        setMessages(messages => [...messages, tempMessage]);
        setMessage("");

        try {
            let res = await loroClient.sendTextMessage(messageBody);
            res = await res.json();
            const cachedMessages = cache.get(`chat-${cache.get("chat-open")}`).messages;
            cache.set(`chat-${cache.get("chat-open")}`, {
                ...cache.get(`chat-${cache.get("chat-open")}`),
                messages: [...cachedMessages, { ...messageBody, _id: res.msgID, emisorUserID, type: "text", messageVerificationStatus: messageStatusVerification }]
            });
            setMessages(messages => [...messages.slice(0, -1), { ...messageBody, _id: res.msgID, emisorUserID, type: "text", messageVerificationStatus: messageStatusVerification }])
        } catch (error) {
            console.log(error.errType, error.errMessage)
            let errType = "";
            if (!navigator.online) errType = "offline";
            if (error.errCode >= 400 || error.errCode === undefined) errType = "server";
            setUnsentMessages(unSentMessages => [...unSentMessages, {...tempMessage, sendError: errType}]);
            const cachedMessages = cache.get(`chat-${cache.get("chat-open")}`).messages;
            cache.set(`chat-${cache.get("chat-open")}`, {
                ...cache.get(`chat-${cache.get("chat-open")}`),
                messages: [...cachedMessages, {...tempMessage, sendError: errType}]
            });
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

