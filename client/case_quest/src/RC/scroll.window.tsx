import React, {useEffect, useState} from 'react';
import { UserCase, NotificationsProps, UserInfo, IndCase } from '../data/types';
import { Case, Discovery, Notification, User } from './cards.rc';
import { RecordCard } from '../Screens/wallet/wallet.cards';
import { ActivityIncicator } from './acitivity.incdicator';

// Type guard for individual UserCase elemen
type IncomeProps = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}
interface ScrollWindowProps {
    type: 'Discovery' | 'Notification' | 'User' | 'Case' | 'Record';
    content: UserInfo[] | UserCase | NotificationsProps | IncomeProps[],
    center?: 'c-sw',
    ud?: string,
    fit?: boolean,
    addS?: boolean,
    pt?: boolean
}

const ScrollWindow: React.FC<ScrollWindowProps> = ({ content, type, center, addS, fit, ud, pt }) => {
    return (
         <div className={`${center} overflow-auto scroll-window ${fit && 'fit-container'} ${addS && 'addS'}`}>
            {content?.map((element, index) => (
                <div className='card mb-2 item-card' key={index}>
                    <div className="card-body">
                        {type == 'Case' ? <Case data={element} viewMore/> : type == 'Notification' ? <Notification ud={ud} data={element}/> : type == 'User' ? <User data={element} participant={pt} /> : type == 'Record' ? <RecordCard type='Income' data={element}/> : type == 'Discovery' ? <Discovery data={element} /> : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollWindow;
