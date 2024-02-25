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
    const lastLocation = localStorage.getItem('LCC')
    const [activeContent, setActiveContent] = useState(lastLocation || 'Overview');
    const [caseInfo, setCaseInfo] = useState<any>();
    const caseId = location.state.data.caseId;

    const caseContent: ContentMap = {
        Overview: <CaseOverView caseId={caseId} caseInfo={caseInfo} />,
        Actions: <ActionScreen opname={loading ? '' : caseInfo.participants.find((part:any) => part.name == caseInfo.oppositionName)} caseId={caseId} />,
        Discoveries: <DiscoveryScreen data={caseInfo} />,
        Participants: <Participants caseId={caseId} data={caseInfo} />,
        Court: <Participants caseId={caseId}/>,
    }

    useEffect(() => {
        if (!caseId) {
            alert('Case ID is missing');
            setLoading(false);
            return;
        }
        console.log('Here');
        getCase(caseId).then(res => {
            setCaseInfo(res.case);
            console.log('reached here toos');
    console.log(caseInfo);

    // console.log(caseInfo.participants)
            return setLoading(false);
        }).catch(err => {
            // console.error(caseInfo.oppositionName);
            setLoading(false);
            err.AR ? logout() : alert('An Error Has Occured');
        });
    }, [caseId, activeContent]);

    const handleButtonClick = (content: string) => {
        console.log(caseInfo.participants.filter((part:any) => console.log(part.name)))
        localStorage.setItem('LCC', content);
        return setActiveContent(content);
    };

    if (loading) return <ActivityIncicator fullScreen />

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
                                {key} {key === 'Discoveries' ? `(${caseInfo.discoveries.length})` : key == 'Participants' ? `(${caseInfo.participants.length})` : ''}
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
            )
        )
}

export default ViewCase