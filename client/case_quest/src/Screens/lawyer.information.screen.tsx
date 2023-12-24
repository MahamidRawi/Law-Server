import React, {useContext, useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLawyerInformation } from '../actions/main/home.actions';
import { AuthContext } from '../Providers/auth.provider';
import { Icon } from '@iconify/react';
import { ActivityIncicator } from '../RC/acitivity.incdicator';

interface LawyerInformationProps {}

const LawyerInformationScreen: React.FC<LawyerInformationProps> = () => {
    const [information, setUserInformation] = useState<any>();
    const {logout} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const uid = location.state.uId
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLawyerInformation(uid).then(res => setUserInformation(res.userInfo)).catch(err => logout());
        return setLoading(true)
    }, [])

    return (
        !information ? <ActivityIncicator /> : (
            <div className={`header-decoration ${window.innerWidth <= 685 ? 'mini-scr' : ''}`}>
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className={`card cardPad`}>
                <div className="outer-container">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
                            <Icon icon="solar:user-linear" width={100} height={100}/>
                            <button className="btn btn-primary mt-3" onClick={() => navigate('/Mail', {state: {targetMail: information.email}})}>Contact</button>
                            <button className="btn btn-primary mt-3">Case History</button>
                            <div className="info-scroll-container">
        {/* Your scrollable content goes here */}
    </div>
                            
                            {/* <ScrollWindow content={[]} type={'Notification'}  /> */}
                        </div>
                        <div className='casescontainer' />

                        <div className="col-12 col-md-8">
                            <div className="row text-start">
                                <div className="col-6">
                                    <p>First Name: {information.firstName}</p>
                                    <p>Last Name: {information.lastName}</p>
                                    <p>Data: {information.username}</p>
                                </div>
                                    <div className="col-6">
                                    <p>From : {uid.senderMail}</p>
                                    <p>To : {uid.targetMail}</p>
                                    <p>Username: {uid.date}</p>
                                </div>
                                {<div className="col-6">
                                    <p>Email: {information.email}</p>
                                    <p>Lawyer Since: 20/2/2023</p>
                                    <p>Net Worth: Private</p>
                                </div>}
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
