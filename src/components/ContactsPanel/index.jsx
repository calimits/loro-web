import "./ContactsPanel.css";
import { useCurrentView } from "../ViewManager/context/currentViewContext";
import Contact from "../Contact";
import { useEffect, useRef, useState } from "react";
import { userClient } from "../../loro-api-clients/UserClientInstance";
import cache from "../../utils/chache-ram";

export default function ContactsPanel() {
    const { setCurrentView } = useCurrentView();

    const contactsRef = useRef();

    const defaultStart = cache.get("contacts").start;
    const defaultLimit = cache.get("contacts").limit;
    const isCached = cache.get("contacts").contacts.length > 0;

    const [start, setStart] = useState(defaultStart);
    const [limit, setLimit] = useState(defaultLimit);
    const [scrollEnd, setScrollEnd] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleScroll = (e) => {
        const div = contactsRef.current;
        const boolScroll = div.scrollTop + div.clientHeight >= div.scrollHeight;
        if (boolScroll) {
            setScrollEnd(true);
        }
    }

    useEffect(()=>{
        contactsRef.current.addEventListener("scroll", handleScroll);

        async function getContacts() {
            setLoading(true);
            const res = await userClient.getUserContacts(start, limit);
            cache.set("contacts", {start: start+res.length, limit: limit, contacts: [...res]});
            console.log(cache.get("contacts"))
            console.log(isCached)
            setStart(start+res.length);
            setContacts([...contacts, ...res]);
            setLoading(false);
        }

        if (!isCached) getContacts();  
        if (isCached) setContacts([...contacts, ...cache.get("contacts").contacts]); 

    }, []);

    useEffect(()=>{
        async function getMoreContacts() {
            setLoading(true);
            const res = await userClient.getUserContacts(start, limit);
            if (res.length === 0) return setLoading(false);
            setStart(start+res.length);
            setContacts([...contacts, ...res]);
            setScrollEnd(false);
            setLoading(false);
        }

        getMoreContacts(); 
        
    }, [scrollEnd]);

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
            <div ref={contactsRef} className="contacts"> 
                {contacts.map((contact, index)=>(<Contact key={index} username={contact.username}/>))}
                {loading ? <p className="small-info-text">Loading</p> : null}
            </div>
        </div>
    )
}
