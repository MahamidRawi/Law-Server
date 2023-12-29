import React from 'react';
import { UserCase, NotificationsProps, UserInfo, IndCase } from '../data/types';
import { Case, Notification, User } from './cards.rc';
import { IncomeCard } from '../Screens/wallet/wallet.cards';

// Type guard for individual UserCase elemen
type IncomeProps = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}
interface ScrollWindowProps {
    type: 'Notification' | 'User' | 'Case' | 'Record';
    content: UserInfo[] | UserCase | NotificationsProps | IncomeProps[],
    center?: 'c-sw',
    ud?: string,
    fit?: boolean
}

const ScrollWindow: React.FC<ScrollWindowProps> = ({ content, type, center, fit, ud }) => {
    console.log('HERE IS CONTENT', content)
    return (
         <div className={`${center} overflow-auto scroll-window ${fit && 'fit-container'}`}>
            {content?.map((element, index) => (
                <div className='card mb-2 item-card' key={index}>
                    <div className="card-body">
                        {type == 'Case' ? <Case data={element} viewMore/> : type == 'Notification' ? <Notification ud={ud} data={element}/> : 'User' ? <User data={element} /> : 'Record' ? <IncomeCard data={element}/> : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollWindow;
