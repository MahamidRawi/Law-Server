import React from 'react';
import { UserCase, NotificationsProps, UserInfo, IndCase } from '../data/types';
import { Case, Notification, User } from './cards.rc';

// Type guard for individual UserCase elemen
interface ScrollWindowProps {
    type: 'Notification' | 'User' | 'Case';
    content: UserInfo[] | UserCase | NotificationsProps,
    center?: 'c-sw',
    ud?: string
}

const ScrollWindow: React.FC<ScrollWindowProps> = ({ content, type, center, ud }) => {
    console.log(content)
    return (
         <div className={`${center} overflow-auto scroll-window`}>
            {content?.map((element, index) => (
                <div className='card mb-2 item-card' key={index}>
                    <div className="card-body">
                        {type == 'Case' ? <Case data={element} viewMore/> : type == 'Notification' ? <Notification ud={ud} data={element}/> : 'User' ? <User data={element} /> : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollWindow;
