import ChatList from "../ChatList"
import HeaderBar from "../HeaderBar"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./Home.css"


export default function Home() {
    const {setCurrentView} = useCurrentView();

    return (
        <div className="home">
            <HeaderBar/>
            <ChatList/>
            <button onClick={(e)=>setCurrentView("contacts")} className="contacts-btn">💬</button>
        </div>
    )
}