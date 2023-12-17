import React from 'react';
import { UserCase, NotificationsProps } from '../data/types';

// Type guard for individual UserCase element
function isUserCaseElement(element: any): element is UserCase[number] {
    return element && typeof element === 'object' && '_id' in element;
}

// Type guard for individual NotificationsProps element
function isNotificationsPropsElement(element: any): element is NotificationsProps[number] {
    return element && typeof element === 'object' && 'title' in element;
}

interface ScrollWindowProps {
    content: UserCase | NotificationsProps;
}

const ScrollWindow: React.FC<ScrollWindowProps> = ({ content }) => {
    return (
        <div className='overflow-auto scroll-window'>
            {content.map((element, index) => (
                <div className='card mb-2 item-card' key={index}>
                    <div className="card-body">
                        {isUserCaseElement(element) ? (
                            <>
                                <h5 className="card-title">{element.title}</h5>
                                <p className="card-text">{element.summary}</p>
                            </>
                        ) : isNotificationsPropsElement(element) ? (
                            <>
                                <h5 className="card-title">{element.title}</h5>
                                <p className="card-text">{element.body}</p>
                                {element.viewMore && <a href="#" className="btn btn-primary">View More</a>}
                            </>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScrollWindow;
