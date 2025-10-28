import { useState } from "react";
import { userClient } from "../../../loro-api-clients/UserClientInstance";


export default function useContactForm() {
    const [contactName, setContactName] = useState("");

    const [errors, setErrors] = useState(false);

    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setContactName(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await userClient.addContact2User(contactName);
            setSuccess(true);
        } catch (error) {
            setErrors(true);
        }
    }

    return {
        contactName,
        errors,
        success,
        handleChange,
        handleSubmit
    }
}