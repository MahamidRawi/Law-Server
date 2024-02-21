import React, {FormEvent, useState, useEffect, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import '../wallet/wallet.css';
import { formatDate } from '../../helper/res.helper';
import { getLawyerInformation } from '../../actions/main/home.actions';
import { userValidate } from '../../actions/auth.actions';
import { AuthContext } from '../../Providers/auth.provider';
import { sendMessage as sMessage, startDeposition } from '../../actions/main/cases.actions';

interface LocationState {
    name: string;
    description: string;
    role: string;
  }
  
  interface Message {
    message: string;
    sender: string;
  }
  
const DepositionScreen: React.FC = () => {
    const location = useLocation();
    const { name, shortDescription, role } = location.state.uinf || { name: 'Unknown', description: '', role: 'guest' };
    const caseId = location.state.caseId;
    const {logout} = useContext(AuthContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [myInfo, setMyInfo] = useState<any>();
    const [depositionStarted, setDepositionStarted] = useState(false);
    const [depositionId, setDepositionId] = useState<string>('');
    const subpoenee = {name, role, shortDescription};
    useEffect(() => {
      if (!depositionStarted) {
        console.log('Starting deposition');
        userValidate(localStorage.getItem('user_token'))
          .then(res => {
            setMyInfo(res.info);
            return startDeposition(subpoenee, caseId).then((res: any) => {
              setDepositionId(res.depositionId);
              return setDepositionStarted(true);
            }).catch(err => {
              if (err.AR) logout();
              else alert(JSON.stringify(err) || 'An Error has Occurred');
            });
          })
          .catch(err => {
            logout();
          });
      }
    }, [depositionStarted, caseId]);
  
    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!currentMessage.trim()) return;
  
      const newMessage: Message = {
        message: currentMessage,
        sender: `${myInfo.firstName} ${myInfo.lastName}`
      };     
      setMessages(prevMessages => [...prevMessages, newMessage]);
      console.log(messages)
      try {
        const sentMessage:any = await sMessage(newMessage, depositionId);   
        console.log(sentMessage);
        setMessages(prevMessages => [...prevMessages, sentMessage.message]);
        console.log(messages)
        return setCurrentMessage('');
      } catch (err: any) {
        if (err.AR) return logout();
        return alert(JSON.stringify(err) || 'An Error has Occured');
      }
    };
  
    return (
        <Container fluid className="py-4 c-room">
      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={10} lg={8}>
            <center>
            <h2>Deposition Room</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{name || 'Guest'} ({role})</Card.Title>
              <Card.Text>{shortDescription || 'No Description'}</Card.Text>
            </Card.Body>
          </Card>
          </center>
          <ListGroup className="messages-list mb-3">
            {messages.map((message, index) => (
              <ListGroup.Item key={index} className="text-wrap">
                <strong>{message.sender} :</strong> {message.message}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form onSubmit={sendMessage}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={3}
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">Send</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    );
}

export default DepositionScreen;