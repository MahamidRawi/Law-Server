import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuScreen from "../../RC/menu.screens";

interface ViewCaseProps {

}

const ViewCase: React.FC<ViewCaseProps> = () => {
    const location = useLocation();
    const caseId = location.state.caseId

    return (
        <MenuScreen type='Case' caseId={caseId} />
    )
}

export default ViewCase