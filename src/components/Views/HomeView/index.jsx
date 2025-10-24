import "./HomeView.css"
import Home from "../../Home"
import Chat from "../../Chat"
import ProfilePanel from "../../ProfilePanel"


export default function HomeView() {
    return(
        <div className="home-view">
            <ProfilePanel/>            
            {/*<Home/>*/}
            <div className="space-background"></div>
            {/*<Chat/>*/}
        </div>
    )
}