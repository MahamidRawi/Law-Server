import React, {useEffect, useState} from 'react';
import ScrollWindow from '../RC/scroll.window';
import { NotificationsProps } from '../data/types';

interface NotProps {
    content: Array<NotificationsProps>
}

const NotificationScreen: React.FC<NotProps> = ({content}) => {
    const not = [
        {
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },
        {
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        },{
            title: 'A new Title',
            body: 'The Body of this notification is at follows, We order you to go here and there'
        }
    ]
    return (
        <div className="header-decoration">
        <div className="p-container">
            {content?.length > 0 ? <ScrollWindow type='Notification' content={not} /> : 
                <div className='testerror'>
                    <p className="alert alert-light text-center">No Notifications</p>
                </div>
            } 
                
        </div>
        </div>
    )
}

export default NotificationScreen;