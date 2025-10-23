import "./LogoutForm.css"

export default function LogoutForm() {
    return (
        <form className="logout-form">
            <h2 className="login-title">Log out</h2>
            <p className="login-title align-center">Are you sure you want to log out?</p>
            <div className="btn-container">
                <button className="form-btn">No</button>
                <button className="form-btn">Yes</button>
            </div>
        </form>
    )
}