import "./ContactForm.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import useContactForm from "./hooks/useContactForm";

export default function ContactForm({classNames=""}) {
    const {setCurrentView} = useCurrentView();

    const {
        contactName,
        errors,
        success,
        handleChange,
        handleSubmit
    } = useContactForm();

    return (
        <div className={`${classNames}`}>
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("contacts")}>←</p>
                    <h2 className="app-title">New Contact</h2>
                </div>
            </header>
            <form className="password-form" onSubmit={handleSubmit}>
                <input required id="currentPassword" value={contactName} onChange={handleChange} type="text" placeholder="username" className="password-input"/>
                {success ? <p className="small-info-text">Contact added succesfully</p> : null}
                {errors ? <p className="small-info-text">An error ocurred. Please try again</p> : null}
                <input type="submit" className="submit-btn"/>
            </form>
        </div>
    )
}