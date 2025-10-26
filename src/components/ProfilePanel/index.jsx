import AccountHeaderPanel from "../ProfileHeaderPanel"
import "./ProfilePanel.css"
import profilePic from "../../assets/loro-profile.png"
import useProfile from "./hooks/useProfile";

export default function () {
    const {
        userInfo,
        loading, 
        successEdit,
        errors, 
        saveEmail,
        saveInfo,
        saveName,
        handleChange
    } = useProfile();

    if (loading) return <h3 className="account-panel">Loading ...</h3>

    return (
        <div className="account-panel ">
            <AccountHeaderPanel />
            <div className="profile-info-container">
                <img src={profilePic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username">@</label>
                    <input value={userInfo.username} onChange={handleChange} type="text" className="info" id="username"/>
                    <input type="button" value="Save" onClick={saveName} className={successEdit.username ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.usernameLength ? <p className="small-info-text">Must have more than 2 chararcters and less than 30.</p> : null}
                {errors.username ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="email">✉</label>
                    <input value={userInfo.email} onChange={handleChange} type="text" className="info" id="email"/>
                    <input type="button" value="Save" onClick={saveEmail} className={successEdit.email ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.emailValidation ? <p className="small-info-text">Invalid email.</p> : null}
                {errors.email ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input value={userInfo.description} onChange={handleChange} type="text" className="info" id="description"/>
                    <input type="button" onClick={saveInfo} value="Save" className={successEdit.description ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.descriptionLength ? <p className="small-info-text">Description must have less than 200 characters.</p> : null}
                {errors.description ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <p className="pink-clickable">Change password</p>
                </div>
            </div>
        </div>
    )
}