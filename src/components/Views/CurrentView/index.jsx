import "./CurrentView.css"
import Home from "../../Home"
import Chat from "../../Chat"
import ProfilePanel from "../../ProfilePanel"
import View from "../../View"
import ViewManeger from "../../ViewManager"
import { CurrentViewProvider } from "../../ViewManager/context/currentViewContext"
import PasswordPanel from "../../PasswordPanel"
import AccountPanel from "../../AccountPanel"
import ContactsPanel from "../../ContactsPanel"
import ContactForm from "../../ContactForm"


export default function CurrentView() {
    return (
        <div className="current-view">
            <CurrentViewProvider>
                <ViewManeger>
                    <View view="home" element={<Home/>}/>
                    <View view="profile" element={<ProfilePanel/>}/>
                    <View view="password-panel" element={<PasswordPanel/>}/>
                    <View view="account" element={<AccountPanel/>}/>
                    <View view="contacts" element={<ContactsPanel/>}/>
                    <View view="add-contact" element={<ContactForm/>}/>
                </ViewManeger>
            </CurrentViewProvider>
            <div className="space-background"></div>
            {/*<Chat/>*/}
        </div>
    )
}