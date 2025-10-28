import "./ContactsPanel.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import Contact from "../Contact";
import { useEffect, useRef } from "react";


export default function ContactsPanel() {
    const { setCurrentView } = useCurrentView();

    /*const contactsRef = useRef();

    useEffect(()=>{
        console.log(contactsRef)
        contactsRef.current.addEventListener("scroll", (e)=> {
            console.log("scroll")
        })
    }, [])*/

    return (
        <div className="contacts-panel">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Contacts</h2>
                </div>
            </header>
            <p className="actions border-bottom">New Chat</p>
            <p onClick={(e)=>setCurrentView("add-contact")} className="actions border-bottom">New contact</p>
            <p className="subtitle">Contacts in Loro</p>
            <div className="contacts"> 
            </div>
        </div>
    )
}
