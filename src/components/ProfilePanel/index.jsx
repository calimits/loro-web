import AccountHeaderPanel from "../ProfileHeaderPanel"
import "./ProfilePanel.css"
import profilePic from "../../assets/loro-profile.png"

export default function () {
    return (
        <div className="account-panel ">
            <AccountHeaderPanel />
            <div className="profile-info-container">
                <img src={profilePic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username-info">@</label>
                    <input type="text" className="info" id="username-info"/>
                    <input type="button" value="Save" className="edit-btn"/>
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="email-info">✉</label>
                    <input type="text" className="info" id="email-info"/>
                    <input type="button" value="Save" className="edit-btn"/>
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description-info">🛈</label>
                    <input type="text" className="info" id="description-info"/>
                    <input type="button" value="Save" className="edit-btn"/>
                </div>
                <div className="profile-info-box">
                    <p className="pink-clickable">Change password</p>
                </div>
            </div>
        </div>
    )
}