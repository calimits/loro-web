import ChatList from "../ChatList"
import HeaderBar from "../HeaderBar"
import "./Home.css"


export default function Home() {
    return (
        <div className="home">
            <HeaderBar/>
            <ChatList/>
        </div>
    )
}