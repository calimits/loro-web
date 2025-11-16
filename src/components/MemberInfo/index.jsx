import { useState } from 'react';
import profilePic from '../../assets/contact-pic.png'
import cache from '../../utils/chache-ram'
import { loroClient } from '../../loro-api-clients/loroClientInstance';

export default function MemberInfo({members, setMembers, memberSelected}) {
    const showOptions = members.find(u => u._id === cache.get("user-ID"));
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const handleAdd2AdminsClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const chatID = cache.get("chat-open");
            const memberID = memberSelected._id;
            await loroClient.putChatAdminStatus41User(true, chatID, memberID);
            const updateMembers = members;
            updateMembers.find(u => u._id===memberID).isAdmin = true;
            cache.set(`members-${cache.get("chat-open")}`, updateMembers);
            setMembers(updateMembers);
            setError(false);
            setSuccess(true);
            setTimeout(() => { setSuccess(false) }, 1200);
        } catch (error) {
            setError(true);
        }
    }

    const handleDeleteFromAdminsClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const chatID = cache.get("chat-open");
            const memberID = memberSelected._id;
            await loroClient.putChatAdminStatus41User(false, chatID, memberID);
            const updateMembers = members;
            updateMembers.find(u => u._id===memberID).isAdmin = false;
            cache.set(`members-${cache.get("chat-open")}`, updateMembers);
            setMembers(updateMembers);
            setError(false);
            setSuccess(true);
            setTimeout(() => { setSuccess(false) }, 1200);
        } catch (error) {
            setError(true);
        }
    }

    const handleDeleteFromChatClick  = async (e) => {
        e.stopPropagation();
        try {
            const chatID = cache.get("chat-open");
            const memberID = memberSelected._id;
            await loroClient.deleteOneChatMember(chatID, memberID);
            const updateMembers = members;
            const res = updateMembers.filter(u => u._id !== memberID);
            setMembers(res);
            cache.set(`members-${cache.get("chat-open")}`, res);
            setError(false);
            setSuccess(true);
            setTimeout(() => { setSuccess(false) }, 1200);
        } catch (error) {
            setError(true);
        }
    } 

    return (
        <div className="member-info-modal">
            <img src={profilePic} alt="Profile Photo" className="member-photo" />
            <h3 className="member-name ">{memberSelected.username}</h3>
            <p className="chat-title text link">{memberSelected.email}</p>
            {memberSelected.isAdmin ? <p className='small-info-text'>Admin</p> : null}
            {showOptions ? 
            <div className="btn-modal-container">
                {memberSelected.isAdmin ? 
                <button className="modal-btn color-red"onClick={handleDeleteFromAdminsClick} >Delete from admins</button> : 
                <button className="modal-btn color-green" onClick={handleAdd2AdminsClick} >Add to admins</button>}
                <button className="modal-btn color-red" onClick={handleDeleteFromChatClick}>Delete from chat</button>
            </div> : null}
            {error ? <p className='small-info-text'>An error ocurred. Please try again.</p>: null}
            {success ? <p className='small-info-text'>Operation done succesfully.</p>: null}
        </div>
    )
}