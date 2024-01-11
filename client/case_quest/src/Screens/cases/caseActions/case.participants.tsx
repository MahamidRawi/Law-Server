import React, {useState, useEffect} from 'react';

interface ParticipantsProps {
    caseId?: string
}

const Participants: React.FC<ParticipantsProps> = ({caseId}) => {
    return (
        <h1>{caseId}</h1>
    )
}

export default Participants