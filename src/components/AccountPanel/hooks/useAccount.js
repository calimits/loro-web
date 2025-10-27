import { useNavigate } from "react-router-dom";



export default function useAccount() {
    const navigate = useNavigate();

    const handleLogoutClick = (e) => {
        e.preventDefault();
        navigate("/logout");
    }

    const handleDeleteAccountClick = (e) => {
        e.preventDefault();
        navigate("/delete-account")
    }

    return {
        handleDeleteAccountClick,
        handleLogoutClick
    }
}