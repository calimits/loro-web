import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./ContactsSelector.css"
import { useEffect, useState } from "react";
import useContacts from "../ContactsPanel/hooks/useContacts";
import Contact from "../Contact";

export default function ContactsSelector() {
    const { setCurrentView } = useCurrentView();
    const [showForm, setShowForm] = useState(false);
    const { contacts,
        loading,
        contactsRef,
        edit,
        setEdit,
        selected,
        setSelected } = useContacts();

    useEffect(() => {
        setEdit(true);
    }, [])

    useEffect(() => { console.log(selected) }, [selected])

    return (
        <div className="chat-form-container">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("contacts")}>←</p>
                    <h2 className="app-title">Select contacts</h2>
                </div>
            </header>
                <div ref={contactsRef} className="contacts">
                    {contacts.map((contact, index) => (<Contact key={index} setEdit={setEdit} setSelected={setSelected}
                        edit={edit} username={contact.username} id={contact.id} />))}
                    {loading ? <p className="small-info-text">Loading</p> : null}
                    {loading ? <p className="small-info-text">An error ocurred. We couldn't delete ypu contacts. Please try agaian.</p> : null}
                </div>
                <button onClick={(e) => setCurrentView("contacts")} className="contacts-btn">➜</button>
        </div>
    )
}