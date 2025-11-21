import { createContext, useContext, useEffect, useMemo, useState } from "react";


const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [unReadMessages, setUnReadMessages] = useState([]);
    const [unSentMessages, setUnsentMessages] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatOpenID, setChatOpenID] = useState("");
    
    const setters = useMemo(()=>({
        setChats,
        setUnReadMessages,
        setChatOpen,
        setChatOpenID, 
        setUnsentMessages
    }), []);

    const values = useMemo(()=>({
        chats,
        unReadMessages,
        chatOpen,
        chatOpenID,
        unSentMessages
    }), [chats, unReadMessages, chatOpen, chatOpenID, unSentMessages]);

    const contextValues = useMemo(()=>({
        ...values,
        ...setters
    }), [values, setters]);

    useEffect(()=>console.log(unSentMessages), [unSentMessages]);
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