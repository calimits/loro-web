import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socketioClient from "../../socket-io-client/socketioClientInstance";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";

const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [unRecievedChats, setUnRecievedChats] = useState([]);
    const [unRecievedMessages, setUnRecievedMessages] = useState([]);
    const [unSentMessages, setUnsentMessages] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatOpenID, setChatOpenID] = useState("");
    
    const setters = useMemo(()=>({
        setChats,
        setUnRecievedMessages,
        setChatOpen,
        setChatOpenID, 
        setUnsentMessages,
        setUnRecievedChats
    }), []);

    const values = useMemo(()=>({
        chats,
        unRecievedMessages,
        chatOpen,
        chatOpenID,
        unSentMessages,
        unRecievedChats
    }), [chats, unRecievedMessages, chatOpen, chatOpenID, unSentMessages, unRecievedChats]);

    const contextValues = useMemo(()=>({
        ...values,
        ...setters
    }), [values, setters]);

    //Helpers
    const addChat = async (chatID) => {
        try {
            const res = await loroClient.getChats41User(0, 15);
            const chat = res.find(c => c._id === chatID);
            setChats(prevChats => [chat, ...prevChats]);
        } catch (error) {
            setUnRecievedChats(prevChats => [...prevChats, chatID]);
        }
    }

    //Socket callbacks
    const onMessage = (msg, ack)=> {
        const userID = cache.get("user-ID");
        if (msg.emisorUserID !== userID) {
            msg.messageVerificationStatus.find(u => u.receptorUserID === userID).isRecieved = true;
            setUnRecievedMessages([msg, ...unRecievedMessages]);
            setChats(prevChats => {
                let chat = prevChats.find(c => c._id === msg.chat_id);
                if (!chat) {
                    addChat(msg.chat_id);
                    return prevChats;
                }

                const remainChats = prevChats.filter(c => c._id !== msg.chat_id);
                return [chat, ...remainChats];
            });
        }

        ack({error: false, data: [{status: 200}]});
    }

    useEffect(()=>console.log(unRecievedMessages), [unRecievedMessages]);

    useEffect(()=>{
        socketioClient.connectionEvent();
        socketioClient.onMessageEvent(onMessage);
    }, []);

    return (
        <ConversationContext.Provider value={contextValues}>
            {children}
        </ConversationContext.Provider>
    )
}

const useConversation = () => {
    const context = useContext(ConversationContext);
    if (!context) throw new Error("useConversation not inside provider");
    return context;
}

export {ConversationContext, ConversationProvider, useConversation};