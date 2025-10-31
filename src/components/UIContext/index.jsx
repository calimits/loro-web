import { createContext, useContext, useEffect, useState } from "react";



const UIContext = createContext();

const UIProvider = ({children}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 560);

    useEffect(()=>{
        const checkScreenSize = (e) => {
            setIsMobile(window.innerWidth < 560)
        }

        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, [])

    const data = {
        isMobile
    }

    return (
        <UIContext.Provider value={data}>
            {children}
        </UIContext.Provider>
    )
}

const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error("useUI not inside provider");
    return context;
}

export {UIContext, UIProvider, useUI}