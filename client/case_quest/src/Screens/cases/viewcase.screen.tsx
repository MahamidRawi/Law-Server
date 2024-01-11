import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuScreen from "../../RC/menu.screens";
import { ActivityIncicator } from "../../RC/acitivity.incdicator";
import { title } from "process";
import '../../wallet.css';
import { ContentMap } from "../../data/data";
import ActionScreen from "./caseActions/actions.screen";
import CaseOverView from "./caseActions/case.overview";
import Participants from "./caseActions/case.participants";
import DiscoveryScreen from "./caseActions/discoveries.screen";

interface ViewCaseProps {

}

const ViewCase: React.FC<ViewCaseProps> = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [activeContent, setActiveContent] = useState('Overview');
    const caseId = location.state.data.caseId

    const caseContent: ContentMap = {
        Overview: <CaseOverView caseId={caseId} />,
        Actions: <ActionScreen />,
        Discoveries: <DiscoveryScreen />,
        Participants: <Participants caseId={caseId} />
    }

    useEffect(() => {setTimeout(() => setLoading(false), 300)},);

    const handleButtonClick = (content: React.SetStateAction<string>) => setActiveContent(content);

        return (
            loading ? <ActivityIncicator fullScreen /> : (
    <div className="p-p-c">
                <div className="wallet-container">
                    <div className="balance-display">
                        {caseId}
                    </div>
                    <div className="navigation-buttons">
                        {Object.keys(caseContent).map((key) => (
                            <button
                                key={key}
                                className={activeContent === key ? 'active' : ''}
                                onClick={() => handleButtonClick(key)}>
                                {key}
                            </button>
                        ))}
                    </div>
                    <div className="content-area">
                        <div className="content-area2">
                            <div className="scroll-wallet">
                        {caseContent[activeContent as keyof ContentMap]}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            ))
}

export default ViewCase