import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/auth.provider';
import '../wallet.css';
import { getWallet } from '../actions/main/wallet.actions';
import { balanceParser } from '../helper/res.helper';
import { ActivityIncicator } from '../RC/acitivity.incdicator';
import { RecordsScreen } from './wallet/wallet.records';
import TransferScreen from './wallet/wallet.transfer';

interface WalletProps {}

interface ContentMap {
    [key: string]: ReactElement;
}

type incomeParams = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}

const Wallet: React.FC<WalletProps> = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const wNumber = location.state?.walletNumber;
    const tRoute = location.state?.targetRoute;
    const walletNumber = wNumber ? wNumber : ''
    const targetRoute = tRoute ? tRoute : 'Income';
    const { logout } = useContext(AuthContext);
    const [activeContent, setActiveContent] = useState(targetRoute);
    const [wallet, setWallet] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);
    const incomeRecords: incomeParams[] = [
        {
            from: 'Company A',
            amount: 1500.00,
            date: new Date('2022-01-01'),
            senderId: 'comp-a-123'
        },
        {
            from: 'Company B',
            amount: 2500.00,
            date: new Date('2022-02-15'),
            senderId: 'comp-b-456'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },
        {
            from: 'Company C',
            amount: 3500.00,
            date: new Date('2022-03-20'),
            senderId: 'comp-c-789'
        },

    ];
    
    const content: ContentMap = {
        Income: <RecordsScreen type='Income' recordList={wallet.income} />,
        Expenses: <RecordsScreen type='Expense' recordList={wallet.expenses} />,
        Invoices: <div>Invoices Content</div>,
        Transfer: <TransferScreen walletNumber={walletNumber} />
    };

    useEffect(() => {
        setLoading(true); // Set loading to true at the start of the effect
    getWallet()
        .then(res => {
            setWallet(res.wallet);
            return setLoading(false);
        })
        .catch(err => {
            setLoading(false); // Also set loading to false if there is an error
            if (err.AR) {
                logout();
            } else {
                alert('An Error has Occurred');
            }
        });
    }, [activeContent]);

    const handleButtonClick = (content: React.SetStateAction<string>) => {
        setActiveContent(content); // Update the active content based on the button clicked
    };

    return (
<div className="p-p-c">
            <div className="wallet-container">
                <div className="balance-display">
                    {wallet && wallet.balance ? balanceParser(wallet.balance) : ''}
                </div>
                <div className="navigation-buttons">
                    {Object.keys(content).map((key) => (
                        <button
                            key={key}
                            className={activeContent === key ? 'active' : ''}
                            onClick={() => handleButtonClick(key)}>
                            {key}
                        </button>
                    ))}
                </div>
                <div className="content-area">
                    <div className="content-area2">
                    {content[activeContent as keyof ContentMap]}
                    </div>
                </div>
            </div>
        </div>
        )
};

export default Wallet;
