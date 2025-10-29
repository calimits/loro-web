import "./ContactsPanel.css";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import Contact from "../Contact";
import useContacts from "./hooks/useContacts";

export default function ContactsPanel() {
    const { setCurrentView } = useCurrentView();
    const { contacts, 
        loading, 
        contactsRef,
        edit, 
        setEdit, 
        error,
        selected,
        setSelected,
        handleCancelClick,
        handleDeleteClick } = useContacts();
    
    return (
        <div className="contacts-panel">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Contacts</h2>
                </div>
                <div className="display-flex">
                    {edit ? <p className="delete-btn small-info-text" onClick={handleCancelClick}>Cancel</p> : null}
                    {edit ? <p className="delete-btn small-info-text" onClick={handleDeleteClick}>Delete</p> : null}
                </div>
            </header>
            <p className="actions border-bottom">New Chat</p>
            <p onClick={(e) => setCurrentView("add-contact")} className="actions border-bottom">New contact</p>
            <p className="subtitle">Contacts in Loro</p>
            <div ref={contactsRef} className="contacts">
                {contacts.map((contact, index) => (<Contact key={index} setEdit={setEdit} setSelected={setSelected}
                                                        edit={edit} username={contact.username} id={contact.id} />))}
                {loading ? <p className="small-info-text">Loading</p> : null}
                {loading ? <p className="small-info-text">An error ocurred. We couldn't delete ypu contacts. Please try agaian.</p> : null}
            </div>
        </div>
    )
}
