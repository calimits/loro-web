import "./HeaderBar.css"
import menuIcon from "../../assets/menu-icon.png"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import { useState } from "react";


export default function HeaderBar() {
    const {setCurrentView} = useCurrentView();

    const [menuVisible, setMenuVisible] = useState(false);


    return (
        <header className="header-bar">
            <div className="to-left">
                <div className="dropDown-menu">
                    <img src={menuIcon} className="menu-icon dropDown-btn" onClick={(e)=>setMenuVisible(!menuVisible)}/>
                    <div className={!menuVisible ? "dropDown-content" : "dropDown-content visible"}>
                        <p className="options" onClick={(e) => setCurrentView("account")}>Account</p>
                        <p className="options" onClick={(e) => setCurrentView("profile")}>Profile</p>
                    </div>
                </div>
                <h2 className="app-title">loro-app</h2>
            </div>
            <input type="text" placeholder="Buscar..." className="search"></input>
        </header>
    )
}