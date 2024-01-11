import React, { useState, useEffect } from 'react';

interface CaseOverViewProps {
    caseId?: string
}

const CaseOverView: React.FC<CaseOverViewProps> = ({caseId}) => {
    return (
        <h1>{caseId}</h1>
    )
}

export default CaseOverView