import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";


export default function useDeleteForm() {
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleNoBtnClick = (e) => {
        navigate("/");
    }

    const handleYesBtnClick = async (e) => {
        e.preventDefault();
        try {
            await loroClient.deleteUser();
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