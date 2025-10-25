import { createContext, useContext, useState } from "react";

const CurrentViewContext = createContext();

export const CurrentViewProvider = ({children}) => {
    const [currentView, setCurrentView] = useState('home');

    return (
        <CurrentViewContext.Provider value={{currentView, setCurrentView}}>
            {children}
        </CurrentViewContext.Provider>
    );
}

export const useCurrentView = () => {
    const context = useContext(CurrentViewContext);
    if (!context) throw new Error("useCurrentView not inside provider");
    return context;
}

