import React, {FormEvent, useState, useEffect, useContext, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import '../wallet/wallet.css';
import { userValidate } from '../../actions/auth.actions';
import { AuthContext } from '../../Providers/auth.provider';
import { endDeposition, endSettlement, getCase, getRepresentativeLawyer, sendMessage as sMessage, startDeposition } from '../../actions/main/cases.actions';

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
}

const DepositionScreen: React.FC<DepositionScreenProps> = ({ settlement = false }) => {
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
    const [caseInfo, setCaseInfo] = useState<any>({});
    useEffect(() => {
      if (settlement) {
        getRepresentativeLawyer(caseId).then(res => {
          const {name, role, shortDescription} = res.lawyerInfo;
          console.log(name, role, shortDescription)
          setUserInfo({name, role, shortDescription})}).catch(err => err.AR ? logout() : alert(err.message));
          console.log(userInfo)
        }
      
    }, [depositionStarted, caseId]);

    useEffect(() => {
      console.log(userInfo)
      if (!depositionStarted) {
        console.log(userInfo, caseId)
        userValidate(localStorage.getItem('user_token'))
          .then(res => {
            setMyInfo(res.info);
            getCase(caseId).then(resp => {
              setCaseInfo(resp.case);
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
          })
          .catch(err => logout());
      }
    }, [userInfo]);
    
    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      if (!currentMessage.trim()) return setLoading(false);
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
        const stlmt: any = settlement ? await endSettlement(depositionId) : await endDeposition(depositionId);
        setMessages([]);
        setDepositionStarted(false);
        setEnded(true);
        localStorage.setItem('LCC', 'Discoveries');
        return settlement && stlmt.success == true ? navigate('/verdict', {state: {caseInfo}}) : navigate(-2);
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
              * Please formally close the chat upon completion. Unfinished chats will still be disclosed to the opposing party.
              </Form.Text>
              <br />
              <Form.Text className='text-muted'>{settlement && `* Termination of proceedings within the settlement room shall invariably result in the conclusion of the case. It is to be noted that, under certain circumstances, such termination may lead to an adverse outcome for the party(ies) involved.`}</Form.Text>
            </Card.Body>
          </Card>
          </center>
          <ListGroup className="messages-list-depos mb-3">
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