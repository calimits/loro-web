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
import ContactInfo from "../../ContactInfo"
import ContactsSelector from "../../ContactsSelector"
import ChatForm from "../../ChatForm"
import { useConversation } from "../../ConversationContext"



export default function CurrentView() {
    const {chatOpen} = useConversation();

    return (
        <div className="current-view">
            <CurrentViewProvider>
                <ViewManeger>
                    <View view="home" element={<Home classNames="hide"/>}/>
                    <View view="profile" element={<ProfilePanel/>}/>
                    <View view="password-panel" element={<PasswordPanel/>}/>
                    <View view="account" element={<AccountPanel/>}/>
                    <View view="contacts" element={<ContactsPanel/>}/>
                    <View view="add-contact" element={<ContactForm/>}/>
                    <View view="contact-info" element={<ContactInfo/>}/>
                    <View view="select-contacts" element={<ContactsSelector/>}/>
                    <View view="new-chat" element={<ChatForm/>}/>
                </ViewManeger>
            </CurrentViewProvider>
            {!chatOpen ? 
            <CurrentViewProvider>
                <ViewManeger>
                    <View view="home" element={<Chat/>}></View>
                </ViewManeger>
            </CurrentViewProvider> :
            <div className="space-background"></div>}
        </div>
    )
}