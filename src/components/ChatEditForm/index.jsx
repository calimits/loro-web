import { useCurrentView } from "../ViewManager/context/currentViewContext";
import "./ChatEditForm.css";
import chatPic from "../../assets/chat-pic.png"
import cache from "../../utils/chache-ram";
import { useEffect, useState } from "react";
import Contact from "../Contact"
import { loroClient } from "../../loro-api-clients/loroClientInstance";

export default function ChatEditForm() {
    const chat = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open"));
    const { setCurrentView } = useCurrentView();
    const [isAdmin] = useState(chat.chatUsers.find(user => user.userID === cache.get("user-ID")).isAdmin);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        chatName: chat.name,
        description: chat.description
    });
    const [errors, setErrors] = useState({
        name: false,
        description: false
    })
    const [successEdit, setSuccessEdit] = useState({
        chatName: false,
        description: false
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const getMembers = async () => {
        try {
            const chatUsers = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open")).chatUsers;
            let userIDs = [];
            chatUsers.forEach((user =>  userIDs.push(user.userID)));
            const users = await loroClient.getManyUsersByID(userIDs);
            cache.set(`members-${cache.get("chat-open")}`, users);
            setMembers(users);
        } catch (error) {
            console.log(error)
            console.log(error.errType, error.errMessage);
        }
        
    }

    const saveChatName = async (e) => {
        e.preventDefault();

        try {
            await loroClient.putChatName(formData.chatName, chat._id);
            setSuccessEdit({...successEdit, chatName: true});
            chat.name = formData.chatName;
            setErrors({...errors, name: false});
            setTimeout(() => {
                setSuccessEdit({...successEdit, chatName: false});
            }, 800);
        } catch (error) {
            setErrors({...errors, name: true});
        }

    }

    const saveChatDescription = async (e) => {
        e.preventDefault();

        try {
            await loroClient.putChatDescription(formData.description, chat._id);
            setSuccessEdit({...successEdit, description: true});
            chat.description = formData.description;
            setErrors({...errors, description: false});
            setTimeout(() => {
                setSuccessEdit({...successEdit, description: false});
            }, 800);
        } catch (error) {
            setErrors({...errors, description: true});
        }
    }

    useEffect(()=> {
        async function fetchData() {
            await getMembers();
        }
        const cachedMembers = cache.get(`members-${cache.get("chat-open")}`);
        if (cachedMembers) return setMembers(cachedMembers);
        fetchData();
    }, []);

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
                    <input readOnly={!isAdmin} type="text" className="info" id="chatName" value={formData.chatName} onChange={handleChange}/>
                    {isAdmin ? <input type="button" value="Save" className={successEdit.chatName ? "success-edit" : "edit-btn"} onClick={saveChatName}/> : null}
                </div>
                    {errors.name ? <p className="small-info-text">An error ocurred please try again</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input readOnly={!isAdmin} type="text" className="info" id="description" value={formData.description} onChange={handleChange}/>
                    {isAdmin ? <input type="button" value="Save" className={successEdit.description ? "success-edit" : "edit-btn"} onClick={saveChatDescription}/> : null}
                </div>
                {errors.description ? <p className="small-info-text">An error ocurred please try again</p> : null}
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