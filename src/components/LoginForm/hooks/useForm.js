import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userClient } from "../../../loro-api-clients/UserClientInstance";

export default function useForm() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [IsSignedIn, setIsSignedIn] = useState({
        succesfull: false,
        error: false,
        credentialsErr: false
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userClient.signIn(formData.username, formData.password);
            setIsSignedIn({ ...IsSignedIn, succesfull: true, error: false, credentialsErr: false });
            setTimeout(() => {
                navigate("/");
            }, 800);
        } catch (error) {
            console.log(error.errMessage === "Password don't match")
            if (error.errMessage === "Password don't match") {
                setIsSignedIn({ ...IsSignedIn, credentialsErr: true });
            } else {
                setIsSignedIn({ ...IsSignedIn, error: true });
            }
        }
    }

    return {formData, IsSignedIn, handleChange, handleSubmit}
}
