import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"

export default function Chat({classNames=""}) {
    return (
        <div className={`chat ${classNames}`}>
            <ChatHeader/>
            <MessageBox/>
            <MessageBar/>
        </div>
    )
}