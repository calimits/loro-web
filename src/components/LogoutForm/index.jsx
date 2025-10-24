import useLogoutForm from "./hooks/useLogoutForm"
import "./LogoutForm.css"


export default function LogoutForm() {
    const {logoutErr, handleNoBtn, handleYesBtn} = useLogoutForm();
    
    return (
        <form className="logout-form">
            <h2 className="login-title">Log out</h2>
            <p className="login-title align-center">Are you sure you want to log out?</p>
            <div className="btn-container">
                <button onClick={handleNoBtn} className="form-btn">No</button>
                <button onClick={handleYesBtn} className="form-btn">Yes</button>
            </div>
            {logoutErr ? <p className="small-info-text">An error ourred. Please try again.</p> : null}
        </form>
    )
}