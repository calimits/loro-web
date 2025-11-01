import { createContext, useContext, useMemo, useState } from "react";


const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    
    const setters = useMemo(()=>({
        setChats,
        setMessages,
        setChatOpen
    }), []);

    const values = useMemo(()=>({
        chats,
        messages,
        chatOpen
    }), [chats, messages, chatOpen]);

    const contextValues = useMemo(()=>({
        ...values,
        ...setters
    }), [values, setters]);
    

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