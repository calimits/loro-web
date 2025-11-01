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
import { useEffect, useState } from "react"
import ChatEditForm from "../../ChatEditForm"



export default function CurrentView() {
    const {chatOpen} = useConversation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 560);

    useEffect(()=>{
        const checkScreenSize = (e) => {
            setIsMobile(window.innerWidth < 560)
        }

        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, [])

    return (
        <div className={isMobile && chatOpen ? "display-block" : "current-view"}>
            <CurrentViewProvider>
                <ViewManeger>
                    <View view="home" element={<Home classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="profile" element={<ProfilePanel classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="password-panel" element={<PasswordPanel classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="account" element={<AccountPanel classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="contacts" element={<ContactsPanel classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="add-contact" element={<ContactForm classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="contact-info" element={<ContactInfo classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="select-contacts" element={<ContactsSelector classNames={isMobile && chatOpen ? "hide" : "view"}/>}/>
                    <View view="new-chat" element={<ChatForm/>}/>
                </ViewManeger>
            </CurrentViewProvider>
            {chatOpen ? 
            <CurrentViewProvider>
                <ViewManeger>
                    <View view="home" element={<Chat classNames={isMobile && chatOpen ? "full-screen" : ""}/>}/>
                    <View view="chat-info" element={<ChatEditForm/>}/>
                </ViewManeger>
            </CurrentViewProvider> :
            <div className="space-background"></div>}
        </div>
    )
}