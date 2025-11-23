import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socketioClient from "../../socket-io-client/socketioClientInstance";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";

const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    //chats states
    const [chats, setChats] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatOpenID, setChatOpenID] = useState("");
    const [unRecievedChats, setUnRecievedChats] = useState([]);
    
    //message states
    const [unReadMessages, setUnReadMessages] = useState([]);
    const [unSentMessages, setUnsentMessages] = useState([]);
    const [msgStatus4Update, setMsgStatus4Update] = useState([]);
    
    
    const setters = useMemo(()=>({
        setChats,
        setUnReadMessages,
        setChatOpen,
        setChatOpenID, 
        setUnsentMessages,
        setUnRecievedChats,
        setMsgStatus4Update
    }), []);

    const values = useMemo(()=>({
        chats,
        unReadMessages,
        chatOpen,
        chatOpenID,
        unSentMessages,
        unRecievedChats,
        msgStatus4Update
    }), [chats, unReadMessages, chatOpen, chatOpenID, unSentMessages, unRecievedChats, msgStatus4Update]);

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
            setUnReadMessages([msg, ...unReadMessages]);
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

        ack({error: false, data: [{receptorUserID: userID}]});
    }

    const onMessagesStatusUpdate = (data, ack) => {
        setMsgStatus4Update(msg => [...msg, data]);
        ack({error: false});
    }

    useEffect(()=>console.log(unReadMessages), [unReadMessages]);

    useEffect(()=>{
        socketioClient.connectionEvent();
        socketioClient.onMessageEvent(onMessage);
        socketioClient.onMessagesStatusUpdateEvent(onMessagesStatusUpdate);
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