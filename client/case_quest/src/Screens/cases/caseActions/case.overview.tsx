import React, { useState, useEffect, useContext } from 'react';
import { ActivityIncicator } from '../../../RC/acitivity.incdicator';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { balanceParser, formatDate } from '../../../helper/res.helper';
import { error } from 'console';
import { Button, Form } from 'react-bootstrap';
import '../../../wallet.css'
import { getLawyerInformation } from '../../../actions/main/home.actions';
import { AuthContext } from '../../../Providers/auth.provider';

interface CaseOverViewProps {
    caseId?: string
    caseInfo: any
}

const CaseOverView: React.FC<CaseOverViewProps> = ({caseId, caseInfo}) => {
    const {logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [uInfo, setUInfo] = useState<any>();
    
    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.setItem('LCC', 'Overview');
        setLoading(true);
        if (caseInfo) {
            getLawyerInformation(caseInfo.owners[0]).then(res => {
                setUInfo(res.userInfo);
                setLoading(false);
            }).catch(err => logout())
        }
    }, [caseInfo])

    return (
        loading ? <ActivityIncicator fullScreen /> : (
            <div className="container cov-parent clr d-flex  justify-content-center overflow-auto">
            <div className="h-c">
                <h2 className='mb-4'>Case Overview</h2>
            </div>
            <div className="coi-container">
                <p><b>Prosecuting Attorney : </b>{caseInfo.prosecution == uInfo._id ? `${uInfo.firstName} ${uInfo.lastName}` : caseInfo.prosecution}</p>
                <p><b>Defense Attorney : </b>{caseInfo.defense == uInfo._id ? `${uInfo.firstName} ${uInfo.lastName}` : caseInfo.defense}</p>
                <p><b>Summary : </b>{caseInfo.summary}</p>
                <p><b>Started on : </b>{formatDate(caseInfo.date)}</p>
                <p><b>Status : </b>{caseInfo.status ? 'Over' : 'Ongoing'}</p>
            </div>
        </div>
    )
    )
}

export default CaseOverView