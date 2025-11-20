import { useState } from "react";
import { useConversation } from "../ConversationContext"
import "./ChatHeader.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import cache from "../../utils/chache-ram";

export default function ChatHeader({ deleteMsg }) {
    const { chatOpen, setChatOpen, chatOpenID } = useConversation();
    const { setCurrentView } = useCurrentView();
    const [menuVisible, setMenuVisible] = useState(false);

    const chat = cache.get("chats").chats.find(chat => chat._id === chatOpenID);

    return (
        <header className="chat-header cool-bar">
            <div className="display-flex">
                {chatOpen && window.innerWidth < 560 ? <p className="back-btn" onClick={e => setChatOpen(false)}>←</p> : null}
                <h3 className="chat-name" onClick={e => setCurrentView("chat-info")}>{chat.name}</h3>
            </div>
            <div className="display-flex">
                {deleteMsg ? <p className="delete-btn small-info-text">Cancel</p> : null}
                {deleteMsg ? <p className="delete-btn small-info-text">Delete</p> : null}
            </div>
        </header>
    )
}

