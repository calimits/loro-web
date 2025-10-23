import "./HomeView.css"
import Home from "../../Home"
import Chat from "../../Chat"

export default function HomeView() {
    return(
        <div className="home-view">
            <Home/>
            <div className="space-background"></div>
            {/*<Chat/>*/}
        </div>
    )
}