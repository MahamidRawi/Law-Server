import React, { useEffect } from 'react';
import { IndCase, NotificationsProps, UserCase } from '../data/types';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';

interface NotificationProps {
    data: any,
    viewMore?: boolean
}

interface CaseProps {
    data: any,
    viewMore?: boolean,
}

interface UserProps {
    data: any,
    viewMore?: boolean,
    resize?: boolean
}

const Notification: React.FC<NotificationProps> = ({ data }) => {
    const navigate = useNavigate();
    return (
        <>
                                <h4 className="card-title">{data.sender ? `To : ${data.targetMail}` : `From : ${data.senderMail}`}</h4>
                                <h5 className="card-title">Subject : {data.subject}</h5>
                                <br />
                                <button onClick={() => navigate('/ViewMail', {state: {data}})} className="btn btn-primary">Open</button>
                                
                            </>
    )
}

const Case: React.FC<CaseProps> = ({data, viewMore = false}) => {
    return (
        <>
                                <h5 className="card-title">{data.title}</h5>
                                <p className="card-text">{data.summary}</p>
                                {viewMore && <Link to="#" className="btn btn-primary">View More</Link>}
                            </>
    )
}

const User: React.FC<UserProps> = ({data, viewMore = false, resize=false}) => {
    const navigate = useNavigate();
    return (
    //     <Card style={{ width: '18rem' }}>
    //         <Card.Header>
    //         <Icon icon="solar:user-linear" width={100} height={100}/>
                
    //         </Card.Header>
    //   <Card.Body>
    //     <Card.Title>John Doe</Card.Title>
    //     <Card.Text>
    //       Some quick example text to build on the card title and make up the
    //       bulk of the card's content.
    //     </Card.Text>
    //     <Button variant="primary">Go somewhere</Button>
    //   </Card.Body>
    // </Card>
    <div className={`container py-3 ${resize ? 'f-content' : ''}`}>
    <div className="row">
      {/* <div className="col-md-6 mx-auto"> */}
        {/* <div className="card"> */}
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <Icon icon="solar:user-linear" width={100} height={100}/>
            </div>
            {/* <div className="vertical-line"></div>  */}
            <div className="flex-grow-1">
              <p className="mb-2">Name: {data.firstName} {data.lastName}</p>
              <p className="mb-2">Email: {data.email}</p>
            </div>
            <div className="d-flex flex-column">
              <button className="btn btn-primary mb-2" onClick={() => navigate("/MoreInfo", {state: { uId: data._id }})}>More</button>
              <button className="btn btn-outline-primary" onClick={() => navigate('/Mail', {state: {targetMail: data.email}})}>Contact</button>
            </div>
          </div>
        </div>
      </div>
    // </div>
//   </div>
    
    )
}

export {Notification, Case, User}