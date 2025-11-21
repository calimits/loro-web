import { useState } from "react";
import { useConversation } from "../ConversationContext"
import "./ChatHeader.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";

export default function ChatHeader({ messageStates }) {
    const { chatOpen, setChatOpen, chatOpenID } = useConversation();
    const { setCurrentView } = useCurrentView();
    const [menuVisible, setMenuVisible] = useState(false);

    const {messages, setMessages, deleteMsg, setDeleteMsg, selectedMsgs, setSelectedMsgs} = messageStates;
    const chat = cache.get("chats").chats.find(chat => chat._id === chatOpenID);

    const handleDeleteMsgs = async (e) => {
        e.preventDefault();

        try {
            await loroClient.deleteManyMessages(chatOpenID, selectedMsgs);
            const remainMsgs = messages.filter(msg => !selectedMsgs.includes(msg._id));
            setMessages(remainMsgs);
            cache.set(`chat-${cache.get("chat-open")}`, {...cache.get(`chat-${cache.get("chat-open")}`), messages: remainMsgs});
            setSelectedMsgs([]);
            setDeleteMsg(false);        
        } catch (error) {
            //skip baby
        }
    }

    return (
        <header className="chat-header cool-bar">
            <div className="display-flex">
                {chatOpen && window.innerWidth < 560 ? <p className="back-btn" onClick={e => setChatOpen(false)}>←</p> : null}
                <h3 className="chat-name" onClick={e => setCurrentView("chat-info")}>{chat.name}</h3>
            </div>
            <div className="display-flex">
                {deleteMsg ? <p className="delete-btn small-info-text" onClick={e=>setDeleteMsg(false)}>Cancel</p> : null}
                {deleteMsg ? <p className="delete-btn small-info-text" onClick={handleDeleteMsgs}>Delete</p> : null}
            </div>
        </header>
    )
}

