import { createContext, useContext, useMemo, useState } from "react";


const ConversationContext = createContext();

const ConversationProvider = ({children}) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);

    const setters = useMemo(()=>({
        setChats,
        setMessages
    }), []);

    const values = useMemo(()=>({
        chats,
        messages
    }), [chats, messages]);

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