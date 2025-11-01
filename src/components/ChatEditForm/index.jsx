import { useCurrentView } from "../ViewManager/context/currentViewContext";
import "./ChatEditForm.css";
import chatPic from "../../assets/chat-pic.png"
import cache from "../../utils/chache-ram";
import { useEffect, useState } from "react";
import Contact from "../Contact"
import { loroClient } from "../../loro-api-clients/loroClientInstance";

export default function ChatEditForm() {
    const { setCurrentView } = useCurrentView();
    const [members, setMembers] = useState([]);

    const getMembers = async () => {
        try {
            const chatUsers = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open")).chatUsers;
            let userIDs = [];
            chatUsers.forEach((user =>  userIDs.push(user.userID)));
            const users = await loroClient.getManyUsersByID(userIDs);
            setMembers(users);
        } catch (error) {
            console.log(error)
            console.log(error.errType, error.errMessage);
        }
        
    }

    useEffect(()=> {
        async function fetchData() {
            await getMembers();
        }
        fetchData();
    }, [])

    return (
        <div className="view-right">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Chat info</h2>
                </div>
            </header>
            <div className="profile-info-container overflow-auto">
                <img src={chatPic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username">@</label>
                    <input type="text" className="info" id="username" />
                    <input type="button" value="Save" className={"edit-btn"} />
                </div>
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input type="text" className="info" id="description" />
                    <input type="button" value="Save" className={"edit-btn"} />
                </div>
                <p className="small-info-text">Members</p>
                <div className="contacts-box">
                    {members.map(((member, i) => (
                        <Contact key={i} username={member.username}/>
                    )))}
                </div>
            </div>
        </div>
    )
}