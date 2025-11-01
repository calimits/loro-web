import { useConversation } from "../ConversationContext"
import "./ChatHeader.css"

export default function ChatHeader() {
    const {chatOpen, setChatOpen} = useConversation();

    return (
        <header className="chat-header">
            <div className="display-flex"> 
                {chatOpen && window.innerWidth < 560 ? <p className="back-btn" onClick={e=>setChatOpen(false)}>←</p> : null}
                <h3 className="chat-name">Chat name</h3>
            </div>
            <div className="dropDown-menu-chat">
                <p className="chat-options dropDown-btn">...</p>
                <div className="dropDown-chat-content">
                    <p className="options">Option 1</p>
                    <p className="options">Option 2</p>
                    <p className="options">Option 3</p>
                    <p className="options">Option 4</p>
                    <p className="options">Option 5</p>
                </div>
            </div>
        </header>
    )
}

