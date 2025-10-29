import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./ChatForm.css";
import chatPic from "../../assets/chat-pic.png"
import { useState } from "react";
import cache from "../../utils/chache-ram";

export default function ChatForm() {
    const { setCurrentView } = useCurrentView();
    const [members] = useState(cache.get("chat-members"));
    const [formData, setFormData] = useState({
        chatName: "",
        description: ""
    });
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    return(
        <div className="chat-form-container">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("select-contacts")}>←</p>
                    <h2 className="app-title">New Chat</h2>
                </div>
            </header>
            <div className="profile-info-container">
                <img src={chatPic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="chatName">@</label>
                    <input type="text" value={formData.chatName} onChange={handleChange} className="info min-width-8rem" id="chatName" />
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input type="text" value={formData.description} onChange={handleChange} className="info min-width-8rem" id="description" />
                </div>
                <div className="profile-info-box">
                    {members.length > 1 ? (<p className="small-info-text">{members.length} members</p>) :
                                            (<p className="small-info-text">{members.length} member</p>)}
                </div>
                <div className="profile-info-box">
                    <input type="button" value="Create chat" className="edit-btn"/>
                </div>
            </div>
        </div>
    )
}