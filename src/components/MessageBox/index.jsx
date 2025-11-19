import cache from "../../utils/chache-ram";
import Message from "../Message"
import "./MessageBox.css"

const userID = cache.get("user-ID");

export default function MessageBox({messages, setMessages}) {

    return(
        <div className="message-container">
            {messages.map((message)=>(
                <Message classNames={userID === message.emisorUserID ? "sent-message" : "recieved-message"}
                        content={message.content} time={message.dateTime} sended={false}
                        statusVerification={message.messageVerificationStatus}/>
            ))}
        </div>
    )
}

