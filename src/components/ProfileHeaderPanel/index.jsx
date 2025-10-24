import "./Header.css"

export default function AccountHeaderPanel() {
    return (
        <header className="header-bar cool-bar">
            <div className="to-left">
                <p className="back-btn">←</p>
                <h2 className="app-title">Account</h2>
            </div>
            <input type="text" placeholder="Buscar..." className="search"></input>
        </header>
    )
}