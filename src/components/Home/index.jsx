import ChatList from "../ChatList"
import HeaderBar from "../HeaderBar"
import { useCurrentView } from "../ViewManager/context/currentViewContext"
import "./Home.css"


export default function Home({classNames=""}) {
    const {setCurrentView} = useCurrentView();

    return (
        <div className={`home ${classNames}`}>
            <HeaderBar/>
            <ChatList/>
            <button onClick={(e)=>setCurrentView("contacts")} className="contacts-btn">💬</button>
        </div>
    )
}