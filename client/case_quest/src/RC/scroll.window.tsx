import React from 'react';
import { UserCase, NotificationsProps, UserInfo } from '../data/types';

// Type guard for individual UserCase elemen
interface ScrollWindowProps {
    content: UserInfo[] | UserCase | NotificationsProps | undefined
    type: 'Notification' | 'User' | 'Case';
}

const ScrollWindow: React.FC<ScrollWindowProps> = ({ content, type }) => {
    return (
        <div className='overflow-auto scroll-window'>
            {content?.map((element, index) => (
                <div className='card mb-2 item-card' key={index}>
                    <div className="card-body">
                        {type == 'Case' }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollWindow;
