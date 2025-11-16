import { useCurrentView } from "../ViewManager/context/currentViewContext";
import "./ChatEditForm.css";
import chatPic from "../../assets/chat-pic.png"
import cache from "../../utils/chache-ram";
import { useEffect, useState } from "react";
import { useConversation } from "../ConversationContext";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
import ChatMember from "../ChatMember";
import MemberInfo from "../MemberInfo";
import useChatEditForm from "./hooks/useChatEditForm";


export default function ChatEditForm() {
    const { setCurrentView } = useCurrentView();

    const {
        chat,
        isAdmin, 
        members,
        setMembers,
        formData,
        errors, 
        successEdit,
        showModals, 
        setShowModals,
        memberSelected,
        setMemberSelected,
        handleChange,
        saveChatName,
        saveChatDescription, 
        hideModals,
        showLeaveChatModal,
        handleLeaveChatClick
    } = useChatEditForm();

    return (
        <div className="view-right">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Chat info</h2>
                </div>
            </header>
            <div className="profile-info-container overflow-auto pos-relative" onClick={hideModals}>
                <img src={chatPic} alt="Profile Photo" className="profile-photo" />
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="username">@</label>
                    <input readOnly={!isAdmin} type="text" className="info" id="chatName" value={formData.chatName} onChange={handleChange} />
                    {isAdmin ? <input type="button" value="Save" className={successEdit.chatName ? "success-edit" : "edit-btn"} onClick={saveChatName} /> : null}
                </div>
                {errors.name ? <p className="small-info-text">An error ocurred please try again</p> : null}
                <div className="profile-info-box">
                    <label className="info-label" htmlFor="description">🛈</label>
                    <input readOnly={!isAdmin} type="text" className="info" id="description" value={formData.description} onChange={handleChange} />
                    {isAdmin ? <input type="button" value="Save" className={successEdit.description ? "success-edit" : "edit-btn"} onClick={saveChatDescription} /> : null}
                </div>
                {errors.description ? <p className="small-info-text">An error ocurred please try again</p> : null}
                <p className="link-btn" onClick={showLeaveChatModal}>Leave chat</p>
                {showModals.leaveChatModal ? <div className="modal-container">
                    <div className="modal-window">
                        <p className="link-btn">Are you sure you want to leave this chat?</p>
                        <div className="btn-modal-container">
                            <button className="form-btn" >No</button>
                            <button className="form-btn" onClick={handleLeaveChatClick}>Yes</button>
                        </div>
                        {errors.leaveChat ? <p className="small-info-text">An error ocurred please try again</p> : null}
                    </div>
                </div> : null}
                <p className="small-info-text">Members</p>
                <div className="contacts-box">
                    {members.map(((member, i) => (
                        <ChatMember key={i} member={member} setMemberSelected={setMemberSelected} setShowModals={setShowModals}/>
                    )))}
                </div>
            </div>
            {showModals.memberInfoModal ? <MemberInfo members={members} setMembers={setMembers} memberSelected={memberSelected}/> : null}
        </div>
    )
}