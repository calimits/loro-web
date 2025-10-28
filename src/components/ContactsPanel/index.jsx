import "./ContactsPanel.css";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import Contact from "../Contact";
import useContacts from "./hooks/useContacts";
import { useState } from "react";

export default function ContactsPanel() {
    const { setCurrentView } = useCurrentView();
    const { contacts,loading, contactsRef } = useContacts();
    const [edit, setEdit] = useState(true);

    return (
        <div className="contacts-panel">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Contacts</h2>
                </div>
                <div className="display-flex">
                    {edit ? <p className="delete-btn small-info-text">Cancel</p> : null}
                    {edit ? <p className="delete-btn small-info-text">Delete</p> : null}
                </div>
            </header>
            <p className="actions border-bottom">New Chat</p>
            <p onClick={(e) => setCurrentView("add-contact")} className="actions border-bottom">New contact</p>
            <p className="subtitle">Contacts in Loro</p>
            <div ref={contactsRef} className="contacts">
                {contacts.map((contact, index) => (<Contact key={index} edit={edit} username={contact.username} />))}
                {loading ? <p className="small-info-text">Loading</p> : null}
            </div>
        </div>
    )
}
