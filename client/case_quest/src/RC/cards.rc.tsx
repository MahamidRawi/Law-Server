import React, { useContext, useEffect } from 'react';
import { IndCase, NotificationsProps, UserCase } from '../data/types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { cutResume, formatDate } from '../helper/res.helper';
import { openMail } from '../actions/main/mail.actions';
import { AuthContext } from '../Providers/auth.provider';
import './rc.css'
interface NotificationProps {
    data: any,
    viewMore?: boolean,
    ud?: string
}

interface CaseProps {
    data: any,
    viewMore?: boolean,
}

interface UserProps {
    data: any,
    viewMore?: boolean,
    resize?: boolean,
    participant?: boolean,
    cId?: string
}

const Notification: React.FC<NotificationProps> = ({ data, ud }) => {
    const navigate = useNavigate();
    return (
        <>
                                <h4 className="card-title">{ud == data.senderId ? `To : ${data.to}` : `From : ${data.from}`}</h4>
                                <h5 className="card-title">Subject : {data.subject}</h5>
                                <p className='card-title'>Status : {data.opened ? 'Read' : 'Not Read'}</p>
                                <br />
                                <button onClick={() => navigate('/ViewMail', {state: {data, isSender: ud == data.senderId}})} className="btn btn-primary">{data.targetId !== ud ? 'View Mail' : data.opened && data.targetId == ud ? 'Re-Open' : 'Open'}</button>
                                
                            </>
    )
}

const Case: React.FC<CaseProps> = ({data, viewMore = false}) => {
    return (
        <>
                                <h5 className="card-title">{data.title}</h5>
                                <p className="card-text">{cutResume(data.summary)}</p>
                                {viewMore && <Link to='/ViewCase' state={{data: {caseId: data._id}}} className="btn btn-primary">View Case</Link>}
                            </>
    )
}

const User: React.FC<UserProps> = ({cId, data, resize=false, participant = false}) => {
    const navigate = useNavigate();
    return (
    <div className={`container py-3 ${resize ? 'f-content' : ''} ${data.admin && 'admin'}`}>
    <div className="row">
          <div className="card-body d-flex align-items-center">
            <div className="me-3">
              <Icon icon="solar:user-linear" width={100} height={100}/>
            </div>
            <div className="flex-grow-1">
              <p className="mb-2">Name: {participant ? data.name : `${data.firstName} ${data.lastName}`}</p>
              <p className="mb-2">{participant ? `Role: ${data.role}` : `Email: ${data.email}`}</p>
              {participant && <p className='mb-2'>Description : {data.shortDescription}</p>}
            </div>
            <div className="d-flex flex-column">
              <button className="btn btn-primary mb-2" onClick={() => navigate("/MoreInfo", {state: !participant ? {uId: data._id} : {data, caseId: cId} })}>More</button>
              {!participant && <button className="btn btn-outline-primary" onClick={() => navigate('/Mail', {state: {targetMail: data.email}})}>Contact</button>}
            </div>
          </div>
        </div>
      </div>
    
    )
}

interface DiscoveryProps {
  data: any
}

const Discovery: React.FC<DiscoveryProps> = ({data}) => {
  const navigate = useNavigate();
  return (
    <div className='container py-3'>
    <div className="row">
          <div className="card-body d-flex align-items-center">
            <div className="flex-grow-1">
              <p className="mb-2"><b>Title:</b> {data.title}</p>
              <p className="mb-2"><b>Type :</b> {data.type}</p>
              <p className="mb-2"><b>Content :</b> {data.content.replace('Relevance:', '')}</p>
            </div>
            <div className="d-flex flex-column">
              <button className="btn btn-primary mb-2" onClick={() => navigate("/ViewDiscovery", {state: { data }})}>Details</button>
            </div>
          </div>
        </div>
      </div>
    )
}

const ViewMail: React.FC = () => {
  const location = useLocation();
  const {logout} = useContext(AuthContext);
  const data = location.state.data
  const isSender = location.state.isSender
  const navigate = useNavigate();
  useEffect(() => {
    openMail(data._id).catch(err => err.AR == true ? logout() : alert('An Error Has Occured'));
  });
  return (
    <div className="p-c-c">
    <div className="cardmail card">
  <div className="container py-3">
  <div className="row">
        <div className="card-body d-flex align-items-center">
          
          <div className="flex-grow-1">
            <p className="mb-2"><b>From : </b>{data.from}</p>
            <p className="mb-2"><b>To : </b>{data.to}</p>
            <p className="mb-2"><b>Subject : </b>{data.subject}</p>
            <p className='mb-2'><b>Date : </b>{formatDate(data.date)}</p>
            <br />
            <div className="d-flex flex-column">
            <button className="btn btn-primary mb-2" onClick={() => navigate("/MoreInfo", {state: { uId: data.senderId }})}>View User</button>
            <button className="btn btn-outline-primary" onClick={() => navigate('/Mail', {state: {targetMail: isSender ? data.to : data.from}})}>{isSender ? 'Contact' : 'Reply'}</button>
          </div>
            <div className='scrollable-div' dangerouslySetInnerHTML={{ __html: data.body.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

const ViewDiscovery: React.FC = () => {
  const location = useLocation();
  const data = location.state.data
  return (
    <div className="p-c-c">

    <div className="cardmail card">
  <div className="container py-3">
  <center><h2>Discovery Details</h2></center>

  <div className="row">
        <div className="card-body d-flex align-items-center">          
          <div className="flex-grow-1">
            <p className="mb-2"><b>Title : </b>{data.title}</p>
            <p className="mb-2"><b>Type : </b>{data.type}</p>
            <p className="mb-2"><b>Summary : </b>{data.content}</p>

            <div className="d-flex flex-column">
          </div>
            <div className='scrollable-div ds' dangerouslySetInnerHTML={{ __html: data.exactContent.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

interface ActionCardProps {
  type: 'Subpoena' | 'File Motion' | 'Settle',
  txt: string,
  icon: any,
  caseId: string,
}
const ActionCard: React.FC<ActionCardProps> = ({ type, txt, icon, caseId }) => {
  const navigate = useNavigate();
  return (
    <div className='action-card' onClick={() => navigate(`/${type.replace(' ', '')}`, {state: {caseId, type: type == 'Subpoena' ? 1 : 2}})}>
      <div className="icon-container">
        <div className="icon">{icon}</div>
        <div className="content">
          <h3 className="type">{type}</h3>
          <p className="text">{txt}</p>
        </div>
      </div>
    </div>
  )
}

export {ViewDiscovery, Discovery, Notification, Case, User, ViewMail, ActionCard}