import "./PasswordPanel.css";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import usePasswordForm from "./hooks/usePasswordForm";

export default function PasswordPanel() {
    const {setCurrentView} = useCurrentView();

    const {
        formData,
        success,
        errors,
        handleChange,
        handleSubmit
    } = usePasswordForm();
    
    return (
        <div className="password-panel">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("profile")}>←</p>
                    <h2 className="app-title">Change Password</h2>
                </div>
            </header>
            <form className="password-form" onSubmit={handleSubmit}>
                <input id="currentPassword" value={formData.currentPassword} onChange={handleChange} type="password" placeholder="current password" className="password-input"/>
                <input id="newPassword" value={formData.newPassword} onChange={handleChange} type="password" placeholder="new password" className="password-input"/>
                {success ? <p className="small-info-text">Password changed succesfully.</p> : null}
                {errors.ivalidErr? <p className="small-info-text">Password must have at least 1 upper letter,
                 1 lower letter, 1 number, one special character (/?@$!%*?&) and at least
                 8 characters total.  </p> : null}
                 {errors.httpErr ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                 {errors.matchErr ? <p className="small-info-text">Current password is incorrect.</p> : null}
                <input type="submit" className="submit-btn"/>
            </form>
        </div>
    )
}