import React, { useEffect, useState, useContext } from "react";
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
import { getCase } from "../../actions/main/cases.actions";
import { AuthContext } from "../../Providers/auth.provider";

interface ViewCaseProps {

}

const ViewCase: React.FC<ViewCaseProps> = () => {
    const [loading, setLoading] = useState(true);
    const {logout} = useContext(AuthContext);
    const location = useLocation();
    const [activeContent, setActiveContent] = useState('Overview');
    const [caseInfo, setCaseInfo] = useState<any>();
    const caseId = location.state.data.caseId

    const caseContent: ContentMap = {
        Overview: <CaseOverView caseId={caseId} caseInfo={caseInfo} />,
        Actions: <ActionScreen />,
        Discoveries: <DiscoveryScreen />,
        Participants: <Participants caseId={caseId} />,
        Court: <Participants caseId={caseId} />,
    }

    useEffect(() => {
        setLoading(true);
        getCase(caseId).then(res => {
            setCaseInfo(res.case); 
            return setLoading(false)
        }).catch(err => err.AR ? logout() : alert('An Error Has Occured'))
    }, [activeContent]);

    const handleButtonClick = (content: React.SetStateAction<string>) => setActiveContent(content);

        return (
            loading ? <ActivityIncicator fullScreen /> : (
    <div className="p-p-c">
                <div className="wallet-container">
                    <div className="balance-display">
                        {caseInfo.title}
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
                        {caseContent[activeContent as keyof ContentMap]}
                        </div>
                    </div>
                </div>
            </div>
            ))
}

export default ViewCase