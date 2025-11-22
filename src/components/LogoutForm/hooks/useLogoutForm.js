import cache from "../../../utils/chache-ram"
import { useNavigate } from "react-router-dom";
import { loroClient } from "../../../loro-api-clients/loroClientInstance";
import { useState } from "react";


export default function useLogoutForm() {

    const [logoutErr, setLogoutErr] = useState(false);
    const navigate = useNavigate();
    const handleNoBtn = (e) => {
        e.preventDefault();
        navigate("/");
    }

    const handleYesBtn = async (e) => {
        e.preventDefault();
        try {
            await loroClient.logout();
            cache.clear();
            cache.set("contacts", { start: 0, limit: 100000, isAllFetched: false, contacts: [] });
            cache.set("chats", { start: 0, limit: 50, isAllFetched: false, chats: [] });
            navigate("/login");
        } catch (error) {
            setLogoutErr(true);
        }
    }

    return {
        logoutErr,
        handleNoBtn,
        handleYesBtn
    }
}