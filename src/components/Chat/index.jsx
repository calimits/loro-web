import "./Chat.css"
import ChatHeader from "../ChatHeader"
import MessageBox from "../MessageBox"
import MessageBar from "../MessageBar"

export default function Chat() {
    return (
        <div className="chat">
            <ChatHeader/>
            <MessageBox/>
            <MessageBar/>
        </div>
    )
}