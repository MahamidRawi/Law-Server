import React, {useState, useEffect} from 'react';
import '../../../wallet.css'
import ScrollWindow from '../../../RC/scroll.window';

interface ParticipantsProps {
    caseId: string
    data?: any
}

const Participants: React.FC<ParticipantsProps> = ({data, caseId}) => {

    return (
        <div className="scroll-wallet ns">
            <ScrollWindow pt type='User' cId={caseId} content={data.participants} addS />
        </div>
    )
}

export default Participants