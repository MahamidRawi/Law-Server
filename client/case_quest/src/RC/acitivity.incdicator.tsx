import React from "react";
import '../styling.css'

interface ActivityIndicatorProps {
    fullScreen?: boolean
}

export const ActivityIncicator = (props: ActivityIndicatorProps) => {

    return (
        props.fullScreen ? <div className="spinner-parent"><div className="spinner" /></div> : <div className="spinner" style={props.fullScreen ? {position: "fixed", height: "100%", width: "100%"} : {}} />
    )
}