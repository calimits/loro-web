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

    const updateMsgStatus = (waitTime, data, ack) => {
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

            if (!msg) updateMsgStatus(waitTime * 2, data);
        }, waitTime);
        ack({ error: false });
    }

    const updateManyMsgStatus = (waitTime, data, ack) => {
        if (waitTime > 8000) return;
        setTimeout(() => {
            const msgs = [];
            data.forEach((m,i) => {
                console.log(data)
                const msg = cache.get(`chat-${data[i].chat_id}`).messages.find(msg => msg._id === data[i].msgID);
                msgs.push(msg);
            })

            //updating message state
            setMessages(prevMsgs => {
                let msgs = [...prevMsgs];
                const msgState = [];
                data.forEach((m,i)=>{
                    let msg = msgs.find(msg => msg._id === data.msgID);
                    msgState.push(msg);
                });

                if (msgState.length > 0) {
                    msgState.forEach(m => {
                        m.messageVerificationStatus.forEach(r => {
                        if (data[0].receptores.some(u => u.receptorUserID === r.receptorUserID)) {
                            r.isRecieved = true;
                        }
                    });
                    })
                    return [...msgs];
                }

                return prevMsgs;
            });

            //updating cache
            if (msgs.length > 0) {
                msgs.forEach(m => {
                    m.messageVerificationStatus.forEach(r => {
                    if (data.receptores.some(u => u.receptorUserID === r.receptorUserID)) {
                        r.isRecieved = true;
                    }
                });
                })
            };

            if (msgs.length === 0) updateMsgStatus(waitTime * 2, data);
        }, waitTime);
        ack({ error: false });
    }

    const saveOneMsg = (msg, ack) => {
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

    const saveManyMsgs = (msg, ack) => {
        const userID = cache.get("user-ID");
        if (msg[0].emisorUserID !== userID) {
            msg.forEach(m => m.messageVerificationStatus.find(u => u.receptorUserID === userID).isRecieved = true);
            setUnRecievedMessages(msgs => {
                if (msgs.has(msg[0].chat_id)) return new Map(msgs).set(msg[0].chat_id, [...msg, ...msgs.get(msg[0].chat_id)]);
                return new Map(msgs).set(msg[0].chat_id, [...msg]);
            });
            setChats(prevChats => {
                let chat = prevChats.find(c => c._id === msg[0].chat_id);
                if (!chat) {
                    addChat(msg[0].chat_id);
                    return prevChats;
                }

                const remainChats = prevChats.filter(c => c._id !== msg[0].chat_id);
                return [chat, ...remainChats];
            });
        }

        ack({ error: false, data: [{ receptorUserID: userID }] });
    }

    //Socket callbacks
    const onMessage = (msg, ack) => {
        if (!Array.isArray(msg)) return saveOneMsg(msg, ack);
        saveManyMsgs(msg, ack);
    }

    const onMessagesStatusUpdate = (data, ack) => {
        if (!Array.isArray(data)) return updateMsgStatus(1000, data, ack);
        updateManyMsgStatus(1000, data, ack);
    }

    const onChatCreation = (chat, ack) => {
        setChats(prevChats => [{ ...chat }, ...prevChats]);
        cache.set("chats", { ...cache.get("chats"), chats: [{ ...chat }, ...chats] });
        ack({ error: false })
    }

    const onMessageDelete = (msgs, ack) => {
        if (!cache.has(`chat-${msgs[0].chat_id}`)) return;

        const chatMsgs = cache.get(`chat-${msgs[0].chat_id}`).messages;
        let currentMsgs = [];

        msgs.forEach(msg => {
            currentMsgs = chatMsgs.filter(m => m._id !== msg._id);
        });

        cache.set(`chat-${msgs[0].chat_id}`, { ...cache.get(`chat-${msgs[0].chat_id}`), messages: currentMsgs });

        setMessages(prevMsgs => {
            if (prevMsgs.find(m => m._id === msgs[0]._id)) return [...currentMsgs];
            return prevMsgs;
        });

        ack({ error: false });
    }

    //useEffect(() => console.log(messages), [messages]);

    useEffect(() => {
        socketioClient.connectionEvent();
        socketioClient.onMessageEvent(onMessage);
        socketioClient.onMessagesStatusUpdateEvent(onMessagesStatusUpdate);
        socketioClient.onChatCreationEvent(onChatCreation);
        socketioClient.onMessageDeleteEvent(onMessageDelete);
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