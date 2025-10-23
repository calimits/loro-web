import "./MessageBar.css"
import sendIcon from "../../assets/send-message-icon.png"

export default function MessageBar() {
    return(
        <footer className="message-bar">
            <input className="input-message" type="text" placeholder="Escribe un mensaje..."/>
            <button className="send-button">
                <img className="send-message-icon" src={sendIcon}/>
            </button>
        </footer>
    )
}

