import cache from "../../utils/chache-ram";
import { useConversation } from "../ConversationContext";
import Message from "../Message"
import "./MessageBox.css"


export default function MessageBox({messageStates}) {
    const userID = cache.get("user-ID");

    return(
        <div className="message-container">
            {messageStates.messages.map((message, i)=>(
                <Message key={i} classNames={userID === message.emisorUserID ? "sent-message" : "recieved-message"}
                        message={message} messageStates={messageStates}/>
            ))}
        </div>
    )
}

