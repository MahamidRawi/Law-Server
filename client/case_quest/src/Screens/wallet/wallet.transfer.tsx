import React, {useState, useEffect, useContext} from 'react';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import './wallet.css'
import { balanceParser } from '../../helper/res.helper';
import { getWallet } from '../../actions/main/wallet.actions';
import { AuthContext } from '../../Providers/auth.provider';

interface TransferProps {
    walletNumber?: string
}

const TransferScreen: React.FC<TransferProps> = ({walletNumber}) => {
    const [loading, setLoading] = useState(true);
    const {logout} = useContext(AuthContext);
    const [recipientWallet, setRecipientWallet] = useState(walletNumber || '');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [wallet, setWallet] = useState<any>({});

    const reasons = ["Service Payment", "Gift", "Other"];

    useEffect(() => {
        getWallet().then(res => setWallet(res.wallet)).catch(err => err.AR ? logout() : alert('An Error Has Occured'));
        return setLoading(false);
    })

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    };
    return (
        loading ? <ActivityIncicator fullScreen /> : (
            <div className="container clr">
            <h2 className='mb-4'>Transfer Funds</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className='form-label'>Recipient Wallet Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={recipientWallet}
                        onChange={e => setRecipientWallet(e.target.value)}
                        className='mb-4'
                        required />
                </Form.Group>

                <Form.Group>
                    <Form.Label className='form-label'>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        step="1"
                        max={wallet.balance/1.02}
                        className='mb-4'
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required />
                </Form.Group>

                <Form.Group>
                    <Form.Label className='form-label'>Reason</Form.Label>
                    <Form.Control as="select" value={reason} onChange={e => setReason(e.target.value)} className='transfer-reasons mb-4'>
                        <option value="" disabled>Select a reason</option>
                        {reasons.map((r, idx) => <option key={idx} value={r}>{r}</option>)}
                    </Form.Control>
                </Form.Group>
                
                <h5 className='mb-4'>Total + 2% fee : {balanceParser(1.02 * Number(amount))}</h5>

                <Button variant="primary" type="submit">Transfer</Button>
            </Form>
        </div>
        )
    )
}

export default TransferScreen