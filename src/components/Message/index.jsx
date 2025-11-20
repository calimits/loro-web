import { useState } from "react";
import "./Message.css"

export default function Message({classNames, message, deleteMsg, setDeleteMsg}) {
    const d = new Date(message.dateTime); 
    const [date, setDate] = useState(`${d.getMonth()}/${d.getDate()}-${d.getHours()}:${d.getMinutes()}`)
    
    return(
        <div className={`${classNames} message`}>
            <p className="text-message">{message.content}</p>
            <div className="to-the-right flex-container">
                {!message.unSent ? <p className="text-message small-info-text">✔</p> : null}
                {message.messageVerificationStatus.length === 1 && message.statusVerification.isRecieved ? <p className="small-info-text">✔</p> : null}
                <p className="text-message small-info-text">{date}</p>
                {deleteMsg ? <input className="margin-rem" type="checkbox"/> : null}
            </div>
        </div>
    )
}

