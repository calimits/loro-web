import { useState } from "react";
import cache from "../../../utils/chache-ram";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";
import { useCurrentView } from "../../ViewManager/context/currentViewContext";


export default function useChatForm() {
    const {setCurrentView} = useCurrentView();
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
        try {
            await loroClient.postChat(formData.chatName, formData.description, members);
            setCurrentView("home");
        } catch (error) {
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