import "./HeaderBar.css"
import menuIcon from "../../assets/menu-icon.png"
import { useCurrentView } from "../ViewManager/context/currentViewContext"

export default function HeaderBar() {
    const {setCurrentView} = useCurrentView();

    return (
        <header className="header-bar">
            <div className="to-left">
                <div className="dropDown-menu">
                    <img src={menuIcon} className="menu-icon dropDown-btn"/>
                    <div className="dropDown-content">
                        <p className="options" onClick={(e) => setCurrentView("profile")}>Profile</p>
                    </div>
                </div>
                <h2 className="app-title">loro-app</h2>
            </div>
            <input type="text" placeholder="Buscar..." className="search"></input>
        </header>
    )
}