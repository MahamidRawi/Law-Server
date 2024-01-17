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
import { ActionCard } from '../../../RC/cards.rc';

interface ActionScreenProps {
}

const ActionScreen: React.FC<ActionScreenProps> = () => {
    const {logout} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [uInfo, setUInfo] = useState<any>();
    
    const navigate = useNavigate();

    return (
        loading ? <ActivityIncicator fullScreen /> : (
            <div className="container cov-parent clr d-flex  justify-content-center overflow-auto">
            <div className="h-c">
                <h2 className='mb-4'>Actions</h2>
            </div>
            <div className="ac coi-container">
                <ActionCard type='Subpoena' txt='This lets you subpoena' />
                <ActionCard type='Subpoena' txt='This lets you subpoena' />
                <ActionCard type='Subpoena' txt='This lets you subpoena' />
                <ActionCard type='Subpoena' txt='This lets you subpoena' />
                <ActionCard type='Subpoena' txt='This lets you subpoena' />
            </div>
        </div>
    )
    )
}

export default ActionScreen