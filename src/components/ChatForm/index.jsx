import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./ChatForm.css";
import chatPic from "../../assets/chat-pic.png"
import useChatForm from "./hooks/useChatForm";

export default function ChatForm({classNames}) {
    const { setCurrentView } = useCurrentView();
    const {
        formData,
        members,
        error,
        handleChange,
        handleSubmit
    } = useChatForm();

    return(
        <div className={`${classNames}`}>
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("select-contacts")}>←</p>
                    <h2 className="app-title">New Chat</h2>
                </div>
            </header>
            <form className="profile-info-container" onSubmit={handleSubmit}>
                <img src={chatPic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="chatName">@</label>
                    <input required type="text" placeholder="chat-name" value={formData.chatName} onChange={handleChange} className="info min-width-8rem" id="chatName" />
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input required type="text" placeholder="description" value={formData.description} onChange={handleChange} className="info min-width-8rem" id="description" />
                </div>
                <div className="profile-info-box">
                    {members.length > 1 ? (<p className="small-info-text">{members.length} members</p>) :
                                            (<p className="small-info-text">{members.length} member</p>)}
                </div>
                <div className="profile-info-box">
                    <input type="submit" value="Create chat" className="edit-btn"/>
                </div>
                {error ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
            </form>
        </div>
    )
}