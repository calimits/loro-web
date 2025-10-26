import "./Header.css"
import { useCurrentView } from "../ViewManager/context/currentViewContext"

export default function AccountHeaderPanel() {
    const {setCurrentView} = useCurrentView();

    return (
        <header className="header-bar cool-bar">
            <div className="to-left">
                <p className="back-btn" onClick={(e) => setCurrentView("home")}>←</p>
                <h2 className="app-title">Account</h2>
            </div>
        </header>
    )
}