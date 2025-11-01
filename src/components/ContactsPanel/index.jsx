import "./ContactsPanel.css";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import Contact from "../Contact";
import useContacts from "./hooks/useContacts";
import FetchBtn from "../FetchBtn";

export default function ContactsPanel({classNames=""}) {
    const { setCurrentView } = useCurrentView();
    const { contacts, 
        loading, 
        edit, 
        setEdit, 
        error,
        selected,
        setSelected,
        handleCancelClick,
        handleDeleteClick,
        fetchData } = useContacts();
    
    return (
        <div className={`${classNames}`}>
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
            <p className="actions border-bottom" onClick={e=>setCurrentView("select-contacts")}>New Chat</p>
            <p onClick={(e) => setCurrentView("add-contact")} className="actions border-bottom">New contact</p>
            <p className="subtitle">Contacts in Loro</p>
            {!error ? (<div className="contacts">
                {contacts.map((contact, index) => (<Contact key={index} setEdit={setEdit} setSelected={setSelected}
                                                        edit={edit} username={contact.username} id={contact.id} />))}
                {loading ? <p className="small-info-text">Loading</p> : null}
                {loading ? <p className="small-info-text">An error ocurred. We couldn't delete ypu contacts. Please try agaian.</p> : null}
            </div>) : <FetchBtn onClick={fetchData}/>}
        </div>
    )
}
