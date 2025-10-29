import profilePpic from "../../assets/chat-pic.png";
import "./Chat.css"

export default function ChatPreview() {
    return (
        <>
            <section className="chat-container">
                <div className="chat-info">
                    <img className="profile-pic" src={profilePpic}></img>
                    <div className="chat-text-info">
                        <h4 className="chat-title text">Chat-Name</h4>
                        <div className="chat-last-message">
                            <p className="text">✓✓</p>
                            <p className="text">Last-message</p>
                        </div>
                    </div>
                </div>
                <div className="notifications-section">
                    <p className="text highlighted">23</p>
                    <p className="text">Time</p>
                </div>
            </section>
        </>
    )
}