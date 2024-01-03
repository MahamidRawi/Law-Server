import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/auth.provider';
import '../wallet.css';
import { getWallet } from '../actions/main/wallet.actions';
import { balanceParser } from '../helper/res.helper';
import { ActivityIncicator } from '../RC/acitivity.incdicator';
import { RecordsScreen } from './wallet/wallet.records';
import TransferScreen from './wallet/wallet.transfer';

interface WalletProps {
    balance: string
}

interface ContentMap {
    [key: string]: ReactElement;
}

type incomeParams = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}

const Wallet: React.FC<WalletProps> = ({balance}) => {
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
    
    const content: ContentMap = {
        Income: <RecordsScreen type='Income' recordList={wallet.income} />,
        Expenses: <RecordsScreen type='Expense' recordList={wallet.expenses} />,
        Transfer: <TransferScreen walletNumber={walletNumber} />
    };

    const loadPage = () => {
        getWallet()
        .then(res => {
            setWallet(res.wallet);
            return setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            if (err.AR) {
                logout();
            } else {
                alert('An Error has Occurred');
            }
        });
    }

    useEffect(() => {
        setLoading(true);
        loadPage();
    }, [activeContent]);

    const handleButtonClick = (content: React.SetStateAction<string>) => {
        setActiveContent(content);
    };

    return (
        loading ? <ActivityIncicator /> : (
<div className="p-p-c">
            <div className="wallet-container">
                <div className="balance-display">
                    {balance}
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
        ))
};

export default Wallet;
