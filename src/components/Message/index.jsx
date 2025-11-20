import { useState } from "react";
import "./Message.css"

export default function Message({classNames, content, sended, time, statusVerification}) {
    const d = new Date(time); 
    const [date, setDate] = useState(`${d.getMonth()}/${d.getDate()}-${d.getHours()}:${d.getMinutes()}`)
    
    return(
        <div className={`${classNames} message`}>
            <p className="text-message">{content}</p>
            <div className="to-the-right flex-container">
                {!sended ? <p className="text-message small-info-text">✔</p> : null}
                {statusVerification.length === 1 && statusVerification.isRecieved ? <p className="small-info-text">✔</p> : null}
                <p className="text-message small-info-text">{date}</p>
            </div>
        </div>
    )
}

