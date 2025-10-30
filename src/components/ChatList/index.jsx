import { useState } from "react"
import ChatPreview from "../ChatPreview"
import "./ChatList.css"


export default function ChatList() {
    const [chats, setChats] = useState();
    

    return (
        <div className="chat-list">
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={123} />
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={3} />
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={123} />
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={123} />
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={123} />
            <ChatPreview name="chat-name" time="time" lastMessage="bla bla ..."
                checks="✓✓" messages={123} />

        </div>
    )
}