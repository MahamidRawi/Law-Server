import React from 'react';
import { NotificationsProps } from '../data/types';

interface NotificationProps {
    data: {title: string, body: string, viewMore?: boolean}
}

interface CaseProps {
    data: {title: string, summary: string, viewMore?: boolean}
}

const Notification: React.FC<NotificationProps> = ({ data }) => {
    return (
        <>
                                <h5 className="card-title">{data.title}</h5>
                                <p className="card-text">{data.body}</p>
                                {data.viewMore && <a href="#" className="btn btn-primary">View More</a>}
                            </>
    )
}

const Case: React.FC<CaseProps> = ({ data }) => {
    return (
        <>
                                <h5 className="card-title">{data.title}</h5>
                                <p className="card-text">{data.summary}</p>
                                {data.viewMore && <a href="#" className="btn btn-primary">View More</a>}
                            </>
    )
}

export {Notification, Case}