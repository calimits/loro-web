import { useNavigate } from "react-router-dom";
import { userClient } from "../../../loro-api-clients/UserClientInstance";
import { useState } from "react";


export default function useLogoutForm() {

    const [logoutErr, setLogoutErr] = useState(false);
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
            setLogoutErr(true);
        }
    }

    return {
        logoutErr,
        handleNoBtn,
        handleYesBtn
    }
}