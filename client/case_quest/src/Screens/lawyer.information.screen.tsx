import React, {useContext, useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLawyerInformation } from '../actions/main/home.actions';
import { AuthContext } from '../Providers/auth.provider';
import { Icon } from '@iconify/react';
import { ActivityIncicator } from '../RC/acitivity.incdicator';
import { formatDate } from '../helper/res.helper';

interface LawyerInformationProps {}

const LawyerInformationScreen: React.FC<LawyerInformationProps> = () => {
    const [information, setUserInformation] = useState<any>();
    const {logout} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const uid = location.state.uId;
    const participant = location.state.data;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(participant, uid)
        if (!participant) { 
            getLawyerInformation(uid).then(res => {setUserInformation(res.userInfo); setLoading(false)}).catch(err => logout()); }else { setUserInformation(true); setLoading(false)}
    }, [])

    return (
        !information || loading ? <ActivityIncicator fullScreen /> : (
            <div className={`header-decoration ${window.innerWidth <= 685 ? 'mini-scr' : ''}`}>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className={`card cardPad`}>
                <div className="outer-container">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                            <Icon icon="solar:user-linear" width={100} height={100}/>
                            {!participant ? (
                                <>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Mail', {state: {targetMail: information.email}})}>Contact</button>
                            <button className="btn btn-primary mt-3">Case History</button>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Wallet', {state: {targetRoute: 'Transfer', walletNumber: information.walletAddress}})}>Transfer Funds</button>
                            </>
                            ) : (<><p className='mt-1'>{participant.name}</p><button className="btn btn-primary mt-1" onClick={() => navigate('/Wallet', {state: {targetRoute: 'Transfer', walletNumber: information.walletAddress}})}>Deposit</button></>)}
                            <div className="info-scroll-container">
    </div>
                        </div>
                        <div className='casescontainer' />
                        <div className="col-12 col-md-8">
                            <div className="row text-start">
                                <div className="col-6">
                                    <p><b>First Name:</b> {participant ? participant.name.split(' ')[0] : information.firstName}</p>
                                    <p><b>Last Name:</b> {participant ? participant.name.split(' ')[1] : information.lastName}</p>
                                    {!participant ? <p><b>Username:</b> {information.username}</p> : (<><p><b>Role:</b> {participant.role}</p> <p><b>Description:</b> {participant.shortDescription}</p></>)}
                                </div>
                                {!participant && (<div className="col-6">
                                    <>
                                    <p><b>Email:</b> {information.email}</p><p><b>Lawyer Since:</b> {formatDate(information.date).split(' ')[0]}</p><p><b>Wallet Number:</b> {information.walletAddress}</p>
                                    </>
                                </div>)}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        </div>
        )
    )
}

export default LawyerInformationScreen
