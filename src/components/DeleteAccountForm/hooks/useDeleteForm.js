import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userClient } from "../../../loro-api-clients/UserClientInstance";


export default function useDeleteForm() {
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleNoBtnClick = (e) => {
        navigate("/");
    }

    const handleYesBtnClick = async (e) => {
        e.preventDefault();
        try {
            await userClient.deleteUser();
            setTimeout(() => {
                navigate("/sign-up")
            }, 800);
        } catch (error) {
            console.log(error.errType, error.errMessage);
            setError(true)
        }
    }

    return {
        error,
        handleNoBtnClick,
        handleYesBtnClick
    }
}