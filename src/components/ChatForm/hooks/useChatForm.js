import { useState } from "react";
import cache from "../../../utils/chache-ram";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";
import { useConversation } from "../../ConversationContext";

export default function useChatForm() {
    const { setChats } = useConversation();
    const [members] = useState(cache.get("chat-members"));
    const [formData, setFormData] = useState({
        chatName: "",
        description: ""
    });
    const [error, setError] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const chatUsers = [];
        members.forEach(id => {
            chatUsers.push({
                userID: id,
                isAdmin: id === cache.get("user-ID"),
                hasArchivedThisChat: false
            })
        });
        const chat = {
            name: formData.chatName,
            description: formData.description,
            lastUpdated: new Date().toISOString(),
            chatUsers
        }

        try {
            const {_id} = await loroClient.postChat(chat);
            const chats = cache.get("chats").chats;
            setChats(prevChats => [{...chat, _id}, ...prevChats]);
            cache.set("chats", {...cache.get("chats"), chats: [{...chat, _id}, ...chats]});
        } catch (error) {
            console.error("Error en postChat:", error.name, error.message, error)
            setError(true);
        }
    }

    return {
        formData,
        members,
        error,
        handleChange,
        handleSubmit
    }
}