import { useNavigate } from "react-router-dom";
import "./LogoutForm.css"
import { userClient } from "../../loro-api-clients/UserClientInstance";


export default function LogoutForm() {
    const navigate = useNavigate();
    const handleNoBtn = (e) => {
        e.preventDefault();
        navigate("/");
    } 

    const handleYesBtn = async (e) => {
        e.preventDefault();
        try {
            await userClient.logout();
            navigate("/login");
        } catch (error) {
            //manejar error en la visualizacion
            console.log(error.errType, error.errMessage);
        }
    }

    return (
        <form className="logout-form">
            <h2 className="login-title">Log out</h2>
            <p className="login-title align-center">Are you sure you want to log out?</p>
            <div className="btn-container">
                <button onClick={handleNoBtn} className="form-btn">No</button>
                <button onClick={handleYesBtn} className="form-btn">Yes</button>
            </div>
        </form>
    )
}