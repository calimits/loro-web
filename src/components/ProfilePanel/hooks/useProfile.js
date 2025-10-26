import { useEffect, useState } from "react";
import cache from "../../../utils/chache-ram";
import { userClient } from "../../../loro-api-clients/UserClientInstance";
import vd from "../../../utils/Validators";

export default function useProfile() {
    const [userInfo, setUserInfo] = useState({
        _id: "",
        username: "", //3-30c
        profilePhotoURL: "",
        description: "", //max 200
        email: ""
    });

    const [loading, setLoading] = useState(true);

    const [successEdit, setSuccessEdit] = useState({
        username: false,
        email: false,
        description: false
    });

    const [errors, setErrors] = useState({
        username: false,
        usernameLength: false,
        email: false,
        emailValidation: false,
        description: false,
        descriptionLength: false
    })

    useEffect(()=>{
        async function getUserInfo() {
            const user = await userClient.getUserByID();
            setUserInfo(user);
            cache.set("userInfo", user);
            setLoading(false);
        }
        if (cache.has("userInfo")) {
            setUserInfo(cache.get("userInfo"));
            setLoading(false);
            return;
        } 
        getUserInfo();
        
    }, []);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.id]: e.target.value
        })
    }

    const saveName = async (e) => {
        e.preventDefault();

        try {
            if (userInfo.username.length < 3 || userInfo.username.length > 30 ) throw new Error("lengthErr");
            await userClient.putUserName(userInfo.username);
            setSuccessEdit({...successEdit, username: true});
            cache.set("userInfo", userInfo);
            setErrors({...errors, usernameLength: false, username: false})
            setTimeout(() => {
                setSuccessEdit({...successEdit, username: false});
            }, 800);
        } catch (error) {
            if (error.message === 'lengthErr') return setErrors({...errors, usernameLength: true});
            setErrors({...errors, username: true});
        }
    }
    
    const saveEmail = async (e) => {
        e.preventDefault(); 

        try {
            const emailValidator = new vd.EmailValidator();
            if (!emailValidator.validate(userInfo.email)) throw new Error("emailValidation");
            await userClient.putUserEmail(userInfo.email);
            setSuccessEdit({...successEdit, email: true});
            cache.set("userInfo", userInfo);
            setErrors({...errors, email: false, emailValidation: false})
            setTimeout(() => {
                setSuccessEdit({...successEdit, email: false});
            }, 800);
        } catch (error) {
            if (error.message === 'emailValidation') return setErrors({...errors, emailValidation: true});
            setErrors({...errors, email: true});
        }
    }

    const saveInfo = async (e) => {
        e.preventDefault();
        try {
            if (userInfo.description.length > 200 ) throw new Error("lengthErr");
            await userClient.putUserDescription(userInfo.description);
            setSuccessEdit({...successEdit, description: true});
            cache.set("userInfo", userInfo);
            setErrors({...errors, descriptionLength: false, description: false})
            setTimeout(() => {
                setSuccessEdit({...successEdit, description: false});
            }, 800);
        } catch (error) {
            if (error.message === 'lengthErr') return setErrors({...errors, descriptionLength: true});
            setErrors({...errors, description: true});
        }
    }

    return {
        userInfo,
        loading, 
        successEdit,
        errors, 
        saveEmail,
        saveInfo,
        saveName,
        handleChange
    }
}