import React, { useEffect } from 'react';
import { MdOutlineHandshake } from "react-icons/md";
import { IoDocumentTextOutline, IoFileTrayFullOutline } from "react-icons/io5";
import '../../../wallet.css'
import { ActionCard } from '../../../RC/cards.rc';

interface ActionScreenProps {
caseId: string;
opname: object;
}

const ActionScreen: React.FC<ActionScreenProps> = ({caseId, opname}) => {

    useEffect(() => {
        return localStorage.setItem('LCC', 'Actions')
    }, [])

    return (
            <div className="container cov-parent clr d-flex  justify-content-center overflow-auto">
            <div className="h-c">
                <h2 className='mb-4'>Actions</h2>
            </div>
            <div className="ac coi-container">
                <ActionCard caseId={caseId} icon={<IoDocumentTextOutline />} type='Subpoena' txt='Command individuals to testify or present evidence in court through a subpoena.' />
                <ActionCard caseId={caseId} icon={<IoFileTrayFullOutline />} type='File Motion' txt='Initiate a legal request by filing a motion to prompt a court ruling on a specific matter.' />
                <ActionCard pm={opname} caseId={caseId} icon={<MdOutlineHandshake />} type='Settle' txt='Negotiate a settlement to resolve a dispute outside of court.' />
            </div>
        </div>
    )
}

export default ActionScreen