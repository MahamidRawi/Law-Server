import React, {useState, useEffect} from 'react';
import '../../../wallet.css'
import ScrollWindow from '../../../RC/scroll.window';

interface ParticipantsProps {
    caseInfo?: any
}

const Participants: React.FC<ParticipantsProps> = ({caseInfo}) => {
    return (
        <div className="scroll-wallet ns">
            <ScrollWindow pt type='User' content={caseInfo.participants} addS />
        </div>
    )
}

export default Participants