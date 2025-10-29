import "./ContactInfo.css"
import profilePic from "../../assets/contact-pic.png";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import { useEffect, useState } from "react";
import { userClient } from "../../loro-api-clients/UserClientInstance"
import cache from "../../utils/chache-ram";

export default function ContactInfo() {
    const { setCurrentView } = useCurrentView();

    const [contact, setContact] = useState({
        username: "",
        description: "",
        email: ""
    });

    useEffect(()=>{
        async function fetchData() {
            const info = await userClient.getUserByName(cache.get("contact-selected"));
            setContact({...info});
            cache.set(`contact-${cache.get("contact-selected")}`, info);
        }
        if (!cache.has(`contact-${cache.get("contact-selected")}`)) fetchData();
        if (cache.has(`contact-${cache.get("contact-selected")}`)) setContact({...cache.get(`contact-${cache.get("contact-selected")}`)});
    }, [])

    return (
        <div className="contact-info-container">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("contacts")}>←</p>
                    <h2 className="app-title">Contact info</h2>
                </div>
            </header>
            <div className="profile-info-container">
                <img src={profilePic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username">@</label>
                    <p type="text" className="info min-width-8rem" id="username">{contact.username}</p>
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="email">✉</label>
                    <p type="text" className="info min-width-8rem" id="email">{contact.email}</p>
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <p type="text" className="info min-width-8rem" id="description">{contact.description}</p>
                </div>
            </div>
        </div>
    )
}