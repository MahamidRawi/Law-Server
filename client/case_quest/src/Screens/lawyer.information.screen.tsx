import React, {useContext, useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLawyerInformation } from '../actions/main/home.actions';
import { AuthContext } from '../Providers/auth.provider';
import { Icon } from '@iconify/react';
import { ActivityIncicator } from '../RC/acitivity.incdicator';
import { formatDate } from '../helper/res.helper';
interface LawyerInformationProps {}

const LawyerInformationScreen: React.FC<LawyerInformationProps> = () => {
    const [information, setUserInformation] = useState<any>(null);
    const { logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const uid = location.state?.uId;
    const caseId = location.state?.caseId;
    const participant = location.state?.data;

    const subpoenaAvailability = participant?.subpoena || participant?.ctc;

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!participant && uid) {
            getLawyerInformation(uid)
                .then(res => {
                    setUserInformation(res.userInfo);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    logout();
                });
        } else {
            setUserInformation(participant); 
            setLoading(false);
        }
    }, [participant, uid, logout]); 

    if (loading || !information) {
        return <ActivityIncicator fullScreen />;
    }

    return (
        <div className={`header-decoration ${window.innerWidth <= 685 ? 'mini-scr' : ''}`}>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card cardPad">
                    <div className="outer-container">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                                    <Icon icon="solar:user-linear" width={100} height={100} />
                                    <p className="mt-3"><b>Reputation : </b>{information.reputation || 'N/A'}</p>

                                    {!participant ? (
                                        <>
                                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Mail', { state: { targetMail: information.email } })}>Contact</button>
                                            <button className="btn btn-primary mt-3">Case History</button>
                                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Wallet', { state: { targetRoute: 'Transfer', walletNumber: information.walletAddress } })}>Transfer Funds</button>
                                        </>
                                    ) : (
                                        <>
                                            <p className='mt-1'>{participant.name}</p>
                                            <button disabled={!subpoenaAvailability} className="btn btn-primary mt-1" onClick={() => navigate('/Deposition', { state: { caseId, uinf: participant,ctc: participant.ctc } })}>{participant.ctc ? 'Contact' : 'Begin Deposition'}</button>
                                        </>
                                    )}
                                    <div className="info-scroll-container"></div>
                                </div>
                                <div className='casescontainer' />
                                <div className="col-12 col-md-8">
                                    <div className="row text-start">
                                        <div className="col-6">
                                            <p><b>First Name:</b> {participant ? participant.name.replace('Dr. ', '').split(' ')[0] : information.firstName}</p>
                                            <p><b>Last Name:</b> {participant ? participant.name.replace('Dr. ', '').split(' ')[1] : information.lastName}</p>
                                            {!participant ? <p><b>Username:</b> {information.username}</p> : null}
                                            {participant && (
                                                <>
                                                    <p><b>Role:</b> {participant.role}</p>
                                                    <p><b>Description:</b> {participant.shortDescription}</p>
                                                </>
                                            )}
                                        </div>
                                        {!participant && (
                                            <div className="col-6">
                                                <>
                                                    <p><b>Email:</b> {information.email}</p>
                                                    <p><b>Lawyer Since:</b> {formatDate(information.date).split(' ')[0]}</p>
                                                    <p><b>Wallet Number:</b> {information.walletAddress}</p>

                                                </>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LawyerInformationScreen
