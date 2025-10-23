import "./HeaderBar.css"
import menuIcon from "../../assets/menu-icon.png"

export default function HeaderBar() {
    return (
        <header className="header-bar">
            <div className="to-left">
                <div className="dropDown-menu">
                    <img src={menuIcon} className="menu-icon dropDown-btn"/>
                    <div className="dropDown-content">
                        <p className="options">Option 1</p>
                        <p className="options">Option 2</p>
                        <p className="options">Option 3</p>
                        <p className="options">Option 4</p>
                        <p className="options">Option 5</p>
                    </div>
                </div>
                <h2 className="app-title">loro-app</h2>
            </div>
            <input type="text" placeholder="Buscar..." className="search"></input>
        </header>
    )
}