import { createContext, useContext, useEffect, useMemo, useState } from "react";
import socketioClient from "../../socket-io-client/socketioClientInstance";
import cache from "../../utils/chache-ram";
import { loroClient } from "../../loro-api-clients/loroClientInstance";

const ConversationContext = createContext();

const ConversationProvider = ({ children }) => {
    //chats states
    const [chats, setChats] = useState([]);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatOpenID, setChatOpenID] = useState("");
    const [unRecievedChats, setUnRecievedChats] = useState([]);

    //message states
    const [messages, setMessages] = useState([]);
    const [unRecievedMessages, setUnRecievedMessages] = useState(new Map());
    const [unSentMessages, setUnsentMessages] = useState([]);


    const setters = useMemo(() => ({
        setChats,
        setUnRecievedMessages,
        setChatOpen,
        setChatOpenID,
        setUnsentMessages,
        setUnRecievedChats,
        setMessages
    }), []);

    const values = useMemo(() => ({
        chats,
        unRecievedMessages,
        chatOpen,
        chatOpenID,
        unSentMessages,
        unRecievedChats,
        messages
    }), [chats, messages, unRecievedMessages, chatOpen, chatOpenID, unSentMessages, unRecievedChats]);

    const contextValues = useMemo(() => ({
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

    const updateMsgStatus = (waitTime, data) => {
        if (waitTime > 8000) return;
        setTimeout(() => {
            const msg = cache.get(`chat-${data.chatID}`).messages.find(msg => msg._id === data.msgID);

            //updating message state
            setMessages(prevMsgs => {
                let msgs = [...prevMsgs];
                const msgState = msgs.find(msg => msg._id === data.msgID);
                if (msgState) {
                    msgState.messageVerificationStatus.forEach(r => {
                        if (data.receptores.some(u => u.receptorUserID === r.receptorUserID)) {
                            r.isRecieved = true;
                        }
                    });
                    return [...msgs];
                }

                return prevMsgs;
            });

            //updating cache
            if (msg) {
                msg.messageVerificationStatus.forEach(r => {
                    if (data.receptores.some(u => u.receptorUserID === r.receptorUserID)) {
                        r.isRecieved = true;
                    }
                });
            };

            if (!msg) updateMsgStatus(waitTime*2, data);
        }, waitTime);
    }

    //Socket callbacks
    const onMessage = (msg, ack) => {
        const userID = cache.get("user-ID");
        if (msg.emisorUserID !== userID) {
            msg.messageVerificationStatus.find(u => u.receptorUserID === userID).isRecieved = true;
            setUnRecievedMessages(msgs => {
                if (msgs.has(msg.chat_id)) return new Map(msgs).set(msg.chat_id, [msg, ...msgs.get(msg.chat_id)]);
                return new Map(msgs).set(msg.chat_id, [msg]);
            });
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

        ack({ error: false, data: [{ receptorUserID: userID }] });
    }

    const onMessagesStatusUpdate = (data, ack) => {
        updateMsgStatus(1000, data);
        ack({ error: false });
    }

    const onChatCreation = (chat, ack) => {
        setChats(prevChats => [{...chat}, ...prevChats]);
        cache.set("chats", {...cache.get("chats"), chats: [{...chat}, ...chats]});
        ack({error: false})
    }
    
    //useEffect(() => console.log(chats), [chats]);

    useEffect(() => {
        socketioClient.connectionEvent();
        socketioClient.onMessageEvent(onMessage);
        socketioClient.onMessagesStatusUpdateEvent(onMessagesStatusUpdate);
        socketioClient.onChatCreation(onChatCreation);
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

export { ConversationContext, ConversationProvider, useConversation };