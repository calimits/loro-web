import profilePpic from "../../assets/chat-pic.png";
import cache from "../../utils/chache-ram";
import { useConversation } from "../ConversationContext";
import "./Chat.css"

export default function ChatPreview({name, checks, lastMessage, time, messages, id}) {
    const {setChatOpen, setChatOpenID, chatOpenID} = useConversation();

    const handleClick = (e) => {
        cache.set("chat-open", id);
        setChatOpen(true);
        setChatOpenID(id);
    }

    return (
        <>
            <section onClick={handleClick} className="chat-container">
                <div className="chat-info">
                    <img className="profile-pic" src={profilePpic}></img>
                    <div className="chat-text-info">
                        <h4 className="chat-title text">{name}</h4>
                        <div className="chat-last-message">
                            <p className="text">{checks}</p>
                            <p className="text">{lastMessage}</p>
                        </div>
                    </div>
                </div>
                <div className="notifications-section">
                    <p className="text highlighted">{messages}</p>
                    <p className="text">{time}</p>
                </div>
            </section>
        </>
    )
}