import { useState } from "react";
import cache from "../../../utils/chache-ram";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";

export default function useChatForm() {
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
            cache.set("chats", {...cache.get("chats"), chats: [{...chat, _id}, ...chats]});
        } catch (error) {
            console.log(error);
            setError(true);
            console.log(error.errType, error.errMessage);
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