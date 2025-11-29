import { useEffect, useRef } from "react";
import cache from "../../utils/chache-ram";
import Message from "../Message"
import "./MessageBox.css"


export default function MessageBox({ messageStates }) {
    const userID = cache.get("user-ID");
    const chatID = cache.get("chat-open");
    const msgContainerRef = useRef(null);

    useEffect(() => {
        const msgContainer = msgContainerRef.current;
        if (msgContainer) {
            msgContainer.scrollTop = msgContainer.scrollHeight; // mueve el scroll al final
        }
    }, [messageStates.messages]);

    return (
        <div className="message-container" ref={msgContainerRef}>
            {messageStates.messages.map((message, i) => (
                <Message key={i} classNames={userID === message.emisorUserID ? "sent-message" : "recieved-message"}
                    message={message} messageStates={messageStates} />
            ))}
        </div>
    )
}

