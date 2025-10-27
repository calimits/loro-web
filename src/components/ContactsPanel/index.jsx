import "./ContactsPanel.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import Contact from "../Contact";

export default function ContactsPanel() {
    const { setCurrentView } = useCurrentView();

    return (
        <div className="contacts-panel">
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Contacts</h2>
                </div>
            </header>
            <p className="actions border-bottom">New Chat</p>
            <p className="actions border-bottom">New contact</p>
            <p className="subtitle">Contacts in Loro</p>
            <div className="contacts">
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
                <Contact username={"juan"}/>
                <Contact username={"roberto"}/>
                <Contact username={"moco"}/>
            </div>
        </div>
    )
}
