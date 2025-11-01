import ChatPreview from "../ChatPreview";
import "./ChatList.css";
import { useConversation } from "../ConversationContext/index";
import { useEffect, useRef, useState } from "react";
import { loroClient } from "../../loro-api-clients/loroClientInstance";
import cache from "../../utils/chache-ram";
import useInfiniteScroll from "../../custom-hooks/useInfiniteScroll";
import FetchBtn from "../FetchBtn";

export default function ChatList() {
    const { chats, setChats } = useConversation();
    const [start, setStart] = useState(cache.get("chats").start);
    const [limit, setLimit] = useState(cache.get("chats").limit);
    const [error, setError] = useState(false);
    const listRef = useRef();

    const fetchChats = async (e) => {
        try {
            const res = await loroClient.getChats41User(start, limit);
            setStart(start + res.length);
            cache.set("chats", { ...cache.get("chats"), start: start + res.length });
            setChats([...res]);
            cache.set("chats", { ...cache.get("chats"), chats: [...res] });
            setError(false);
        } catch (error) {
            setError(true);
        }
    }

    const getChats = async (e) => {
        try {
            const res = await loroClient.getChats41User(start, limit);
            if (res.length === 0)
                return cache.set("chats", {
                    ...cache.get("chats"),
                    isAllFetched: true,
                });
            setStart(start + res.length);
            cache.set("chats", { ...cache.get("chats"), start: start + res.length });
            setChats([...chats, ...res]);
            cache.set("chats", { ...cache.get("chats"), chats: [...chats, ...res] });
        } catch (error) {
            setError(true);
        }
    };

    useInfiniteScroll({ scrollEnd: cache.get("chats").isAllFetched }, getChats, listRef)

    useEffect(() => {
        async function fetchData() {
            await fetchChats();
        }
        const doFetch = cache.get("chats").chats.length === 0;
        if (doFetch) fetchData();
        if (!doFetch) setChats(cache.get("chats").chats);
    }, []);

    return (
        <div ref={listRef} className="chat-list">
            {!error ? (chats.map((chat, i) => (
                <ChatPreview
                    key={i}
                    name={chat.name}
                    time={""}
                    checks={""}
                    lastMessage={""}
                    messages={""}
                    id={chat._id}
                />
            ))) : <FetchBtn onClick={fetchChats} />}
        </div>
    );
}
