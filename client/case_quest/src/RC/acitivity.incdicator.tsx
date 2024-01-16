import React from "react";
import '../styling.css'

interface ActivityIndicatorProps {
    fullScreen?: boolean
    placeholder?: string
}

export const ActivityIncicator = (props: ActivityIndicatorProps) => {

    return (
        props.fullScreen ? <><div className="spinner-parent"><div className="spinner" /><br /> <p>{props?.placeholder ? props.placeholder : ''}</p></div></> : <div className="spinner" style={props.fullScreen ? {position: "fixed", height: "100%", width: "100%"} : {}} />
    )
}