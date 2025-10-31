import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./AccountPanel.css"
import useAccount from "./hooks/useAccount";

export default function AccountPanel({classNames=""}) {
    const { setCurrentView } = useCurrentView();

    const {
        handleDeleteAccountClick,
        handleLogoutClick
    } = useAccount();

    return (
        <div className={`account-panel-container ${classNames}`}>
            <header className="header-bar cool-bar">
                <div className="to-left">
                    <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                    <h2 className="app-title">Account</h2>
                </div>
            </header>
            <div className="options-panel">
                <p onClick={handleLogoutClick} className="actions">Log out</p>
                <p onClick={handleDeleteAccountClick} className="actions">Delete account</p>
            </div>
        </div>
    )
}