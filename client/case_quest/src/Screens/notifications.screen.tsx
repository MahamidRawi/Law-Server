import React, {useContext, useEffect, useState} from 'react';
import ScrollWindow from '../RC/scroll.window';
import { NotificationsProps, UserInfo } from '../data/types';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/auth.provider';
import { fetchHomePage, getMails } from '../actions/main/home.actions';

interface NotProps {
}

const NotificationScreen: React.FC<NotProps> = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationsProps>([]);
    const [myid, setmyid] = useState('');
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        getMails().then(res => {
            setmyid(res.ud);
            return setNotifications(res.mails.reverse());
        }).catch(err => logout());
    }, []);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredLawyers = notifications.filter(not =>
        not.body.toLowerCase().includes(searchTerm) ||
        not.subject.toLowerCase().includes(searchTerm) ||
        not.to.toLowerCase().includes(searchTerm) ||
        not.from.toLowerCase().includes(searchTerm)
    );

    
    return (
        <div>
            <div className="searchbar">
            <button type="button" className="searchbutton" onClick={() => navigate('/Mail')}>+ New Mail</button>
        <input type="text" className='searchinput' placeholder="Search for Notification" onChange={handleSearchChange} />
        </div>
        <div className="p-container">
            {notifications?.length > 0 ? <ScrollWindow type='Notification' ud={myid} content={filteredLawyers} /> : 
                    <p className="alert alert-light text-center">No Notifications</p>
            } 
        </div>
        </div>
    )
}

export default NotificationScreen;