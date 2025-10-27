import "./DeleteAccountForm.css"
import useDeleteForm from "./hooks/useDeleteForm"

export default function DeleteAccountForm() {
    const {
        error,
        handleNoBtnClick,
        handleYesBtnClick
    } = useDeleteForm();

    return (
        <form className="logout-form">
            <h2 className="login-title">Delete account</h2>
            <p className="login-title align-center">Are you sure you want to delete your account?</p>
            {error ? <p className="small-info-text">An error ourred. Please try again.</p> : null}
            <div className="btn-container">
                <button onClick={handleNoBtnClick} className="form-btn">No</button>
                <button onClick={handleYesBtnClick} className="form-btn">Yes</button>
            </div>
        </form>
    )
}