import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/auth.provider';
import { getLawyerInformation } from '../../actions/main/home.actions';
import { balanceParser, formatDate } from '../../helper/res.helper';
import './wallet.css';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';

interface RecordCardProp {
    data: any
    type: 'Income' | 'Expense'
}

const RecordCard: React.FC<RecordCardProp> = ({ data, type }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<{ firstName?: string, lastName?: string }>({});
    const isIncome = type === 'Income';

    useEffect(() => {
        // Check if the necessary data is present before making a request
        const identifier = isIncome ? data.sender : data.target;
        console.log(isIncome);
        if (identifier) {
            setLoading(true);
            getLawyerInformation(identifier)
                .then(res => {
                    setUserInfo(res.userInfo); 
                    console.log(res.userInfo);// Make sure the response has the expected structure
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    logout();
                });
        } else {
            setLoading(false);
        }
    }, [data, isIncome, logout]);

    if (loading) {
        return <ActivityIncicator fullScreen />; // Use your loading component or indicator
    }

    return (
        <div className="container py-3 record-dimension card">
            <div className="row">
                <div className="card-body d-flex align-items-center">
                    <div className="flex-grow-1">
                        <p className="mb-2"><b>{type === 'Income' ? 'From:' : 'To:'}</b> {userInfo.firstName} {userInfo.lastName}</p>
                        <p className="mb-2"><b>Amount:</b> <span className={type + 'style'}>{isIncome ? '+' : '-'} {balanceParser(Math.abs(data.amount))}</span></p>
                        <p className="mb-2"><b>Reason:</b> {data.reason}</p>
                        <p className="mb-2"><b>Date:</b> {formatDate(data.date)}</p>
                    </div>
                    <div className="d-flex flex-column">
                        {data.email && <button className="btn btn-outline-primary" onClick={() => navigate('/Mail', { state: { targetMail: data.email } })}>Contact</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export { RecordCard };
