import { useState } from "react";
import { userClient } from "../../../loro-api-clients/UserClientInstance";
import vd from "../../../utils/Validators";


export default function usePasswordForm() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [success, setSuccess] = useState(false);
    
    const [errors, setErrors] = useState({
        matchErr: false,
        httpErr: false,
        ivalidErr: false,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        setSuccess(false);
        e.preventDefault();
        const passwordValidator = new vd.PasswordValidator();
        const validation = passwordValidator.validate(formData.newPassword);
        if (!validation) return setErrors({...errors, invalidErr: true});

        try {
            await userClient.putUserPassword(formData.currentPassword, formData.newPassword);
            setSuccess(true);
            setErrors({invalidErr: false, httpErr: false, matchErr: false});
        } catch (error) {
            if (error.errType === "Validation Error") return setErrors({...errors, matchErr: true});
            setErrors({...errors, httpErr: true});
        }
    }

    return {
        formData,
        success,
        errors,
        handleChange,
        handleSubmit
    }
}