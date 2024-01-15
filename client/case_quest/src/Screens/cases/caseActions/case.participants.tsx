import React, {useState, useEffect} from 'react';
import '../../../wallet.css'

interface ParticipantsProps {
    caseId?: string
}

const Participants: React.FC<ParticipantsProps> = ({caseId}) => {
    return (
        <div className="scroll-wallet">
            <h1>{caseId}</h1>
        </div>
    )
}

export default Participants