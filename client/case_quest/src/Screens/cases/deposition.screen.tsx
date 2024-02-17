import React, {FormEvent, useState, useEffect, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import '../wallet/wallet.css';
import { formatDate } from '../../helper/res.helper';
import { getLawyerInformation } from '../../actions/main/home.actions';
import { userValidate } from '../../actions/auth.actions';
import { AuthContext } from '../../Providers/auth.provider';

interface LocationState {
    name: string;
    description: string;
    role: string;
  }
  
  interface Message {
    id: number;
    text: string;
    sender: string;
    role: string;
    date: any
  }
  
function DepositionScreen() {
    const location = useLocation();
    const { name, shortDescription, role } = location.state.uinf || { name: 'Unknown', description: '', role: 'guest' };
    const {logout} = useContext(AuthContext);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [myInfo, setMyInfo] = useState<any>();

    useEffect(() => {
        userValidate(localStorage.getItem('user_token')).then(res => setMyInfo(res.info)).catch(err => logout)
    }, []);
  
    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!currentMessage.trim()) return;
  
      const newMessage: Message = {
        id: messages.length + 1,
        text: currentMessage,
        sender: myInfo.firstName + ' ' + myInfo.lastName,
        role: role,
        date: Date.now()
      };
  
      setMessages([...messages, newMessage]);
      setCurrentMessage('');
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
            {messages.map((message) => (
              <ListGroup.Item key={message.id} className="text-wrap">
                <strong>{message.sender} :</strong> {message.text}
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