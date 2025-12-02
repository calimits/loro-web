import { useEffect, useRef } from "react";
import cache from "../../utils/chache-ram";
import Message from "../Message"
import "./MessageBox.css"
import FetchBtn from "../FetchBtn";


export default function MessageBox({ messageStates }) {
    const userID = cache.get("user-ID");
    const chatID = cache.get("chat-open");
    const msgContainerRef = useRef(null);

    const { fetchErr, getMessages } = messageStates;

    useEffect(() => {
        const msgContainer = msgContainerRef.current;
        if (msgContainer) {
            msgContainer.scrollTop = msgContainer.scrollHeight; // mueve el scroll al final
        }
    }, [messageStates.messages]);

    return (
        <div className="message-container" ref={msgContainerRef}>
            {!fetchErr ? (messageStates.messages.map((message, i) => (
                <Message key={i} msgNumber={i} classNames={userID === message.emisorUserID ? "sent-message" : "recieved-message"}
                    message={message} messageStates={messageStates} />
            ))) : <FetchBtn onClick={getMessages}/>}
        </div>
    )
}

