import React from "react"
import "./ViewManager.css"
import { useCurrentView } from "./context/currentViewContext";

export default function ViewManeger({children}) {
    const {currentView} = useCurrentView();
    
    const currentChild = React.Children.toArray(children).find(
        child => child.props.view === currentView
    );

    return currentChild ? React.cloneElement(currentChild) : null;
}

