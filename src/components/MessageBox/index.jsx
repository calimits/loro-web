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

    const buildMessage = (message) => {
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


    useEffect(() => {
        const msgContainer = msgContainerRef.current;
        if (msgContainer) {
            msgContainer.scrollTop = msgContainer.scrollHeight; // mueve el scroll al final
        }
    }, [messages, members]);

    useEffect(()=>{
        async function postData() {
            try {
                const { messageBody } = buildMessage("hola");
                const { messageBody2 } = buildMessage("puta");
                const msgs = [
                    {...messageBody, type: "text", emisorUserID: cache.get("user-ID"), chat_id: messageBody.chatID},
                    {...messageBody, type: "text", emisorUserID: cache.get("user-ID"), chat_id: messageBody.chatID}
                ];
                console.log(msgs)
                await loroClient.sendManyTextMessages(msgs);
            } catch (error) {
                console.log(error.errType, error.errMessage);
            }
        }
        postData();
    }, [])

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

