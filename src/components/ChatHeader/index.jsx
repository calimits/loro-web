import { useState } from "react";
import { useConversation } from "../ConversationContext"
import "./ChatHeader.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import cache from "../../utils/chache-ram";

export default function ChatHeader() {
    const {chatOpen, setChatOpen} = useConversation();
    const { setCurrentView } = useCurrentView();
    const [menuVisible, setMenuVisible] = useState(false);

    const chat = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open"));
    const [chatName, setChatName] = useState(chat.name);

    return (
        <header className="chat-header cool-bar">
            <div className="display-flex"> 
                {chatOpen && window.innerWidth < 560 ? <p className="back-btn" onClick={e=>setChatOpen(false)}>←</p> : null}
                <h3 className="chat-name" onClick={e=>setCurrentView("chat-info")}>{chatName}</h3>
            </div>
            <div className="dropDown-menu-chat">
                <p className="chat-options dropDown-btn" onClick={(e)=>setMenuVisible(!menuVisible)}>...</p>
                <div className={!menuVisible ? "dropDown-chat-content" : "dropDown-chat-content visible"}>
                    <p className="options">Search</p>
                </div>
            </div>
        </header>
    )
}

