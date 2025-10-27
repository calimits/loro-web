import { Link } from "react-router-dom";
import useFormLogic from "./hooks/useFormLogic"
import "./SignUpForm.css"


export default function SignUpForm() {
    const {formData, errors, IsSignedUp, handleChange, handleSubmit} = useFormLogic();

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Sign up</h2>
            <input onChange={handleChange} value={formData.username} required className="form-input" placeholder="username" id="username" />
            {errors.name? <p className="small-info-text">User name must only have letters, numbers and _.</p> : null}
            {errors.duplicateName? <p className="small-info-text">User name already taken.</p> : null}
            <input onChange={handleChange} value={formData.email} required className="form-input" placeholder="email" id="email" />
            {errors.email? <p className="small-info-text">Invalid email</p> : null}
            {errors.duplicateEmail? <p className="small-info-text">Email already has an account.</p> : null}
            <input type="password" onChange={handleChange} value={formData.password} required className="form-input" placeholder="password" id="password" />
            {errors.password? <p className="small-info-text">Password must have at least 1 upper letter,
                 1 lower letter, 1 number, one special character (/?@$!%*?&) and at least
                 8 characters total.  </p> : null}
            <Link to="/login" className="link">Already have an account?</Link>
            <input type="submit" className="form-submit-btn" />
            {IsSignedUp.succesfull ? <p className="small-info-text">Signing up succesfully.</p> : null}
            {IsSignedUp.error ? <p className="small-info-text">An error ocurred. Try again.</p> : null}
        </form>
    )
}