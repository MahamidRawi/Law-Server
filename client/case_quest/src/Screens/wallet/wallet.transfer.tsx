import React, {useState, useEffect} from 'react';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import './wallet.css'

interface TransferProps {
    walletNumber?: string
}

const TransferScreen: React.FC<TransferProps> = ({walletNumber}) => {
    const [loading, setLoading] = useState(false);
    const [recipientWallet, setRecipientWallet] = useState(walletNumber || '');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');

    // Mock reasons for the select dropdown
    const reasons = ["Mock Reason 1", "Mock Reason 2", "Mock Reason 3"];

    // Handle form submission
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        // Process the form data here
        console.log({ recipientWallet, amount, reason });
        // Add your logic to handle the transfer
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
                        max="200"
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

                <Button variant="primary" type="submit">Transfer</Button>
            </Form>
        </div>
        )
    )
}

export default TransferScreen