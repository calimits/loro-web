import { useState } from "react";
import "./Message.css"
import cache from "../../utils/chache-ram";


export default function Message({ classNames, message, messageStates, msgNumber }) {
    let startDeleteTimeout;
    const d = new Date(message.dateTime);
    const userID = cache.get("user-ID");
    const { deleteMsg, setDeleteMsg, setSelectedMsgs, messages, lastMsgRef } = messageStates;

    const [date, setDate] = useState(`${d.getMonth()}/${d.getDate()}-${d.getHours()}:${d.getMinutes()}`);

    const handleMouseDown = (e) => {
        startDeleteTimeout = setTimeout(() => {
            if (message.emisorUserID === cache.get("user-ID")) setDeleteMsg(true);
        }, 1200);
    }

    const handleMouseUp = (e) => {
        if (startDeleteTimeout) clearTimeout(startDeleteTimeout);
    }

    const handleCheck = (e) => {
        if (e.target.checked) setSelectedMsgs((selected) => [...selected, message._id]);
        if (!e.target.checked) setSelectedMsgs((selected) => {
            const filtered = selected.filter(el => el !== message._id);
            return [...filtered];
        });
    }

    return (
        <div ref={msgNumber === messages.length-1 ? lastMsgRef : null} className={`${classNames} message`} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp}>
            <p className="text-message">{message.content}</p>
            <div className="to-the-right flex-container">
                {!message.unSent && message.emisorUserID === userID ? <p className="text-message small-info-text">✔</p> : null}
                {message.messageVerificationStatus.length === 1 &&
                 message.messageVerificationStatus[0].isRecieved && 
                 message.emisorUserID === userID? <p className="small-info-text">✔</p> : null}
                <p className="text-message small-info-text ">{date}</p>
                {deleteMsg && message.emisorUserID === cache.get("user-ID")? <input className="margin-rem" type="checkbox" onChange={handleCheck}/> : null}
            </div>
        </div>
    )
}

