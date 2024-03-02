import React, {FormEvent, useState, useEffect, useContext, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import '../wallet/wallet.css';
import { userValidate } from '../../actions/auth.actions';
import { AuthContext } from '../../Providers/auth.provider';
import { endDeposition, getRepresentativeLawyer, sendMessage as sMessage, startDeposition } from '../../actions/main/cases.actions';

interface LocationState {
    name: string;
    shortDescription: string;
    role: string;
  }
  
  interface Message {
    message: string;
    sender: string;
  }

interface DepositionScreenProps {
  settlement?: boolean;
  lawyer?: any;
}

const DepositionScreen: React.FC<DepositionScreenProps> = ({ settlement = false, lawyer }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {caseId, uinf} = location.state;
    const [userInfo, setUserInfo] = useState<any>(uinf || {name: 'Unknown', role: 'Guest', shortDescription: 'No Description'});
    let {name, shortDescription, role} = userInfo
    const {logout} = useContext(AuthContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [myInfo, setMyInfo] = useState<any>();
    const [ended, setEnded] = useState<boolean>(false);
    const [depositionStarted, setDepositionStarted] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [depositionId, setDepositionId] = useState<string>('');
    const subpoenee = {name, role, shortDescription};
    useEffect(() => {
      getRepresentativeLawyer(caseId).then(res => setUserInfo(res.lawyerInfo)).catch(err => err.AR ? logout() : alert(err.message));

      if (!depositionStarted || userInfo.name == 'Unknown') {
        console.log(userInfo, caseId)
        userValidate(localStorage.getItem('user_token'))
          .then(res => {
            setMyInfo(res.info);
            return startDeposition(userInfo, caseId).then((res: any) => {
              setDepositionId(res.depositionId);
              setMessages(res.messages);
              setDepositionStarted(true);
              return setLoading(false);
            }).catch(err => {
              if (err.AR) logout();
              else !userInfo && alert(JSON.stringify(err) || 'An Error has Occurred');
            });
          })
          .catch(err => logout());
      }
    }, [depositionStarted, caseId]);
    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      if (!currentMessage.trim()) return;
      setCurrentMessage('');
      const newMessage: Message = {
        message: currentMessage,
        sender: `${myInfo.firstName} ${myInfo.lastName}`
      };     
      setMessages(prevMessages => [...prevMessages, newMessage]);
      try {
        const sentMessage:any = await sMessage(newMessage, depositionId);   
        setMessages(prevMessages => [...prevMessages, sentMessage.message]);
        return setLoading(false);
      } catch (err: any) {
        if (err.AR) return logout();
        return alert(JSON.stringify(err) || 'An Error has Occured');
      }
    };

    const endDepo = async () => {
      setLoading(true);
      try {
        await endDeposition(depositionId);
        setMessages([]);
        setDepositionStarted(false);
        setEnded(true);
        localStorage.setItem('LCC', 'Discoveries');
        return navigate(-2);
      } catch (err:any) {
        if (err.AR) logout();
        else alert(JSON.stringify(err) || 'An Error has Occurred');
      }
    }
  
    return (
        <Container fluid className="py-4 c-room">
      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={10} lg={8}>
            <center>
            <h2>{settlement ? 'Settlement Room' : 'Deposition Room'} ({ended ? 'Ended' : 'Ongoing'})</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{name || 'Guest'} ({role})</Card.Title>
              <Card.Text>{shortDescription || 'No Description'}</Card.Text>
              <Form.Text className="text-muted">
                * Please ensure the chat is formally concluded upon completion. Even if not concluded, the content will be disclosed to the opposing party.
              </Form.Text>
            </Card.Body>
          </Card>
          </center>
          <ListGroup className="messages-list mb-3">
            {messages.map((message, index) => (
              <ListGroup.Item key={index} className="text-wrap">
                <strong>{message.sender} :</strong> {message.message}
              </ListGroup.Item>
            ))}
              <div ref={messagesEndRef} />
          </ListGroup>
          <Form onSubmit={sendMessage}>
            <Form.Group className="mb-3">
              <Form.Control
                as="input"
                disabled={loading}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type your message here..."
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
    <div className="flex-grow-1" style={{ marginRight: '10px', maxWidth: '80%' }}>
        <Button variant="primary" disabled={loading} type="submit" className="w-100">Send</Button>
    </div>
    <div className="flex-grow-0" style={{ maxWidth: '20%' }}>
        <Button variant="danger" disabled={loading} onClick={() => endDepo()} className="w-100">End {settlement ? 'Settlement' : 'Deposition'}</Button>
    </div>
</div>

          </Form>
        </Col>
      </Row>
    </Container>
    );
}

export default DepositionScreen;