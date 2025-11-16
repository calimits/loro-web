import { useEffect, useState } from "react";
import cache from "../../../utils/chache-ram";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";
import { useConversation } from "../../ConversationContext";


export default function useChatEditForm() {
    let chat = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open")) || null;
    let isUserAdmin = false;
    if (chat) isUserAdmin = chat.chatUsers.find(user => user.userID === cache.get("user-ID")).isAdmin
    if (!chat) chat = {name: "", description: ""};
    
    const { setChatOpen, setChats } = useConversation();
    const [isAdmin] = useState(isUserAdmin);
    const [members, setMembers] = useState([]);
    const [formData, setFormData] = useState({
        chatName: chat.name,
        description: chat.description
    });
    const [errors, setErrors] = useState({
        name: false,
        description: false,
        leaveChat: false
    })
    const [successEdit, setSuccessEdit] = useState({
        chatName: false,
        description: false
    });
    const [showModals, setShowModals] = useState({
        leaveChatModal: false,
        memberInfoModal: false
    })
    const [memberSelected, setMemberSelected] = useState({
        username: "",
        email: ""
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const getMembers = async () => {
        try {
            const chatUsers = cache.get("chats").chats.find(chat => chat._id === cache.get("chat-open")).chatUsers;
            let userIDs = [];
            chatUsers.forEach((user => userIDs.push(user.userID)));
            const users = await loroClient.getManyUsersByID(userIDs);

            users.forEach(user => {
                const isAdmin = chatUsers.find(chatUser => chatUser.userID === user._id).isAdmin;
                user.isAdmin = isAdmin;
            });

            cache.set(`members-${cache.get("chat-open")}`, users);
            setMembers(users);
        } catch (error) {
            console.log(error)
            console.log(error.errType, error.errMessage);
        }

    }

    const saveChatName = async (e) => {
        e.preventDefault();

        try {
            await loroClient.putChatName(formData.chatName, chat._id);
            setSuccessEdit({ ...successEdit, chatName: true });
            chat.name = formData.chatName;
            setErrors({ ...errors, name: false });
            setTimeout(() => {
                setSuccessEdit({ ...successEdit, chatName: false });
            }, 800);
        } catch (error) {
            setErrors({ ...errors, name: true });
        }

    }

    const saveChatDescription = async (e) => {
        e.preventDefault();

        try {
            await loroClient.putChatDescription(formData.description, chat._id);
            setSuccessEdit({ ...successEdit, description: true });
            chat.description = formData.description;
            setErrors({ ...errors, description: false });
            setTimeout(() => {
                setSuccessEdit({ ...successEdit, description: false });
            }, 800);
        } catch (error) {
            setErrors({ ...errors, description: true });
        }
    }

    const hideModals = (e) => {
        setShowModals({ leaveChatModal: false, memberInfoModal: false })
    }

    const showLeaveChatModal = (e) => {
        e.stopPropagation();
        setShowModals({ ...showModals, leaveChatModal: true });
    }

    const handleLeaveChatClick = async (e) => {
        e.stopPropagation();
        try {
            await loroClient.deleteOneChatMember(chat._id, cache.get("user-ID"));
            const chats = cache.get("chats").chats.filter(c => c._id !== chat._id);
            cache.set("chats", { ...cache.get("chats"), chats: chats });
            setChats(chats);
            setErrors({ ...errors, leaveChat: false });
            setTimeout(() => {
                setChatOpen(false);
            }, 800);
        } catch (error) {
            setErrors({ ...errors, leaveChat: true });
        }
    }

    useEffect(() => {
        async function fetchData() {
            await getMembers();
        }
        const cachedMembers = cache.get(`members-${cache.get("chat-open")}`);
        if (cachedMembers) return setMembers(cachedMembers);
        fetchData();
    }, []);

    return {
        chat,
        isAdmin, 
        members,
        setMembers,
        formData,
        errors, 
        successEdit,
        showModals, 
        setShowModals,
        memberSelected,
        setMemberSelected,
        handleChange,
        saveChatName,
        saveChatDescription, 
        hideModals,
        showLeaveChatModal,
        handleLeaveChatClick
    }
}