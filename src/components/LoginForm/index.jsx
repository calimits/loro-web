import { Link } from "react-router-dom";
import "./LoginForm.css"
import useForm from "./hooks/useForm";
import { useAuth } from "../AuthContext";


export default function LoginForm() {
    const {formData, IsSignedIn, handleChange, handleSubmit} = useForm();
    const {setIsAuth} = useAuth();

    return (
        <form className="login-form" onSubmit={(e) => {handleSubmit(e); setIsAuth(true)}}>
            <h2 className="login-title">Log in</h2>
            <input value={formData.username} onChange={handleChange} className="form-input" placeholder="username" id="username" />
            <input type="password" value={formData.password} onChange={handleChange} className="form-input" placeholder="password" id="password" />
            {IsSignedIn.succesfull ? <p className="small-info-text">Logged in succesfully.</p> : null}
            {IsSignedIn.credentialsErr ? <p className="small-info-text">Incorrect password.</p> : null}
            {IsSignedIn.error ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
            <Link to="/sign-up" className="link">Don't you have an account?</Link>
            <input type="submit" className="form-submit-btn" />
        </form>
    )
}

