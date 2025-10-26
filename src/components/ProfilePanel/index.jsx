import AccountHeaderPanel from "../ProfileHeaderPanel"
import "./ProfilePanel.css"
import profilePic from "../../assets/loro-profile.png"
import { useEffect } from "react"
import { userClient } from "../../loro-api-clients/UserClientInstance";
import { useState } from "react";
import vd from "../../utils/Validators"

export default function () {
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
            setLoading(false);
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
            setErrors({...errors, descriptionLength: false, description: false})
            setTimeout(() => {
                setSuccessEdit({...successEdit, description: false});
            }, 800);
        } catch (error) {
            if (error.message === 'lengthErr') return setErrors({...errors, descriptionLength: true});
            setErrors({...errors, description: true});
        }
    }

    if (loading) return <h3>Loading ...</h3>

    return (
        <div className="account-panel ">
            <AccountHeaderPanel />
            <div className="profile-info-container">
                <img src={profilePic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username">@</label>
                    <input value={userInfo.username} onChange={handleChange} type="text" className="info" id="username"/>
                    <input type="button" value="Save" onClick={saveName} className={successEdit.username ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.usernameLength ? <p className="small-info-text">Must have more than 2 chararcters and less than 30.</p> : null}
                {errors.username ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="email">✉</label>
                    <input value={userInfo.email} onChange={handleChange} type="text" className="info" id="email"/>
                    <input type="button" value="Save" onClick={saveEmail} className={successEdit.email ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.emailValidation ? <p className="small-info-text">Invalid email.</p> : null}
                {errors.email ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input value={userInfo.description} onChange={handleChange} type="text" className="info" id="description"/>
                    <input type="button" onClick={saveInfo} value="Save" className={successEdit.description ? "success-edit" : "edit-btn"}/>
                </div>
                {errors.descriptionLength ? <p className="small-info-text">Description must have less than 200 characters.</p> : null}
                {errors.description ? <p className="small-info-text">An error ocurred. Please try again.</p> : null}
                <div className="profile-info-box">
                    <p className="pink-clickable">Change password</p>
                </div>
            </div>
        </div>
    )
}