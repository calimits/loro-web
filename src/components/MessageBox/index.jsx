import { useEffect, useRef, useState } from "react";
import cache from "../../utils/chache-ram";
import Message from "../Message"
import "./MessageBox.css"
import FetchBtn from "../FetchBtn";
import { loroClient } from "../../loro-api-clients/loroClientInstance";


export default function MessageBox({ messageStates }) {
    const userID = cache.get("user-ID");
    const msgContainerRef = useRef(null);

    const { fetchErr, fetchData, messages, members } = messageStates;

    useEffect(() => {
        const msgContainer = msgContainerRef.current;
        if (msgContainer) {
            msgContainer.scrollTop = msgContainer.scrollHeight; // mueve el scroll al final
        }
    }, [messages, members]);

    return (
        <div className="message-container" ref={msgContainerRef}>
            {!fetchErr && members.length > 0? (messageStates.messages.map((message, i) => (
                <Message key={i} msgNumber={i} classNames={userID === message.emisorUserID ? "sent-message" : "recieved-message"}
                    message={message} messageStates={messageStates} 
                    emisorName={members.find(m => m._id === message.emisorUserID).username || ""}/>
            ))) : null}
            {fetchErr && members.length === 0? <FetchBtn onClick={fetchData} /> : null}
        </div>
    )
}

