import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import { ValidatorFormFactory } from "../../../../../../certificate-printer/certificate-printer-web/src/helpers/ValidatorFactory";
import { ValidatorFormFactory } from "../../../utils/ValidatorFactory" 
import vd from "../../../utils/Validators";
import { userClient } from "../../../loro-api-clients/UserClientInstance";


export default function useFormLogic() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        duplicateName: false,
        duplicateEmail: false
    });

    const [IsSignedUp, setIsSignedUp] = useState({
        succesfull: false,
        error: false
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const validator = new ValidatorFormFactory().createValidator(e.target.id);

        setErrors({
            ...errors,
            [e.target.id]: !vd.validateData(validator, e.target.value)
        })

        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const duplicateUser = await userClient.getUserByName(formData.username);
            if (duplicateUser) {
                setErrors({ ...errors, duplicateName: true })
                setIsSignedUp({ ...IsSignedUp, error: true });
                return;
            };
            const res = await userClient.signUp(formData.username, formData.email, formData.password);
            setIsSignedUp({ ...IsSignedUp, succesfull: true, error: false });
            setErrors({ ...errors, duplicateEmail: false, duplicateName: false });
            setTimeout(() => {
                navigate("/login");
            }, 800);
        } catch (error) {
            if (error.errType === "DB Error") setErrors({ ...errors, duplicateEmail: true });
            setIsSignedUp({ ...IsSignedUp, error: true });
        }
    }

    return {
        formData,
        errors,
        IsSignedUp,
        handleChange,
        handleSubmit
    }
}