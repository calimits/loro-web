import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"
import { useEffect, useState } from "react"

export default function Chat({classNames=""}) {
    const [messages, setMessages] = useState([]);

    return (
        <div className={`chat ${classNames}`}>
            <ChatHeader/>
            <MessageBox messages={messages} setMessages={setMessages}/>
            <MessageBar setMessages={setMessages}/>
        </div>
    )
}