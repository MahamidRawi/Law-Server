import React, {FormEvent, useState, useEffect, useContext, useRef} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, ListGroup, Card } from 'react-bootstrap';
import '../wallet/wallet.css';
import { userValidate } from '../../actions/auth.actions';
import { AuthContext } from '../../Providers/auth.provider';
import { councilRest, endDeposition, endTrial, getCase, getRepresentativeLawyer, sendCourtMessage, startDeposition, startHearing } from '../../actions/main/cases.actions';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
  
  interface Message {
    message: string;
    sender: string;
  }

interface CourtRoomProps {
  caseId?: string;
}

const CourtRoom: React.FC<CourtRoomProps> = ({caseId}) => {
    const location = useLocation();
    const cID = location.state.cId;
    const navigate = useNavigate();
    const {logout} = useContext(AuthContext);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessage, setCurrentMessage] = useState<string>('');
    const [myInfo, setMyInfo] = useState<any>();
    const [ended, setEnded] = useState<boolean>(false);
    const [rested,setRested] = useState(false);
    const [depositionStarted, setDepositionStarted] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [caseInfo, setCaseInfo] = useState<any>({});
    const [judge, setJudge] = useState<string>('');
    const [isResult, setIsResult] = useState<boolean>(false);

    const [loadingInfo, setLoadingInfo] = useState(true);
    const [depositionId, setDepositionId] = useState<string>('');

    useEffect(() => {
      if (!depositionStarted) {
        userValidate(localStorage.getItem('user_token'))
          .then(res => {
            setMyInfo(res.info);
            return startHearing(cID).then((resn: any) => {
              getCase(cID).then(resp => {
              setDepositionId(resn.hearingId);
              setMessages(resn.messages);
              setDepositionStarted(true);
              setJudge(resn.judge);
              setCaseInfo(resp.case);
              setLoading(false);
              setRested(resn.rested);
              return setLoadingInfo(false);
            }).catch(err => err.AR ? logout() : alert('An Error has occured'));
            }).catch(err => err.AR ? logout() : alert(JSON.stringify(err)));
          })
          .catch(err => logout());
      }
    }, []);
    
    
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      if (!currentMessage.trim()) return setLoading(false);
      const newMessage: Message = {
        message: currentMessage,
        sender: `${myInfo.firstName} ${myInfo.lastName}`
      };     
      setCurrentMessage('');
      setMessages(prevMessages => [...prevMessages, newMessage]);
      try {
        const sentMessage:any = await sendCourtMessage(newMessage, depositionId);   
        setMessages(prevMessages => [...prevMessages, ...sentMessage.message]);
        return setLoading(false);
      } catch (err: any) {
        if (err.AR) return logout();
        return alert(JSON.stringify(err) || 'An Error has Occured');
      }
    };

    const rest = async () => {
      setLoading(true);
      try {
        const rest:any = await councilRest(depositionId);
        setMessages(prevMessages => [...prevMessages, ...rest.message]);
        setRested(true);
        return setLoading(false);
      } catch (err: any) {
        return err.AR ? logout() : alert(JSON.stringify(err));
      }
    }

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

    const endHearing = async () => {
      console.log(depositionId)
      try {
        const result = await endTrial(depositionId);
        
      } catch (err: any) {
        if (err.AR) logout();
        else alert(JSON.stringify(err) || 'An Error has Occurred');
      }
    }

    if (loadingInfo) return <ActivityIncicator fullScreen />
  
    return (
        <Container fluid className="py-4 c-room">
      <Row className="mb-4 justify-content-center">
        <Col xs={12} md={10} lg={8}>
            <center>
                <h2>Court Room</h2>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{caseInfo.title}</Card.Title>
              <Form.Text className="text-muted">
                * Once the chat is concluded, the simulation will be over, and the results will be formally given.
              </Form.Text>
            </Card.Body>
          </Card>
          </center>
          <div className="court-container">
          <ListGroup className="messages-list mb-3">
            {messages.length > 0 && messages.map((message, index) => (
              <ListGroup.Item key={index} className="text-wrap">
                <strong>{message.sender} :</strong> {message.message}
              </ListGroup.Item>
            ))}
              <div ref={messagesEndRef} />
          </ListGroup>
          </div>
          <Form onSubmit={sendMessage}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                disabled={loadingInfo}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Write your closing argument here"
              />
            </Form.Group>
            <div className="d-flex justify-content-center">
    <div className="flex-grow-1" style={{ marginRight: '10px', maxWidth: '75%' }}>
        <Button variant="primary" disabled={loading} type="submit" className="w-100">Send</Button>
    </div>
    <div className="flex-grow-0" style={{ maxWidth: '25%' }}>
        <Button variant="danger" disabled={loading} onClick={() => endHearing()} style={{marginLeft: '10px'}} className="w-100">Verdict</Button>
    </div>
</div>

          </Form>
        </Col>
      </Row>
    </Container>
    );
}

export default CourtRoom;