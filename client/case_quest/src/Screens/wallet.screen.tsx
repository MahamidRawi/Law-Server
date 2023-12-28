import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Providers/auth.provider';
import '../wallet.css';
import { getWallet } from '../actions/main/wallet.actions';
import { balanceParser } from '../helper/res.helper';
import { ActivityIncicator } from '../RC/acitivity.incdicator';

interface WalletProps {}



const Wallet: React.FC<WalletProps> = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const [activeContent, setActiveContent] = useState('Income');
    const [wallet, setWallet] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true); // Set loading to true at the start of the effect
    getWallet()
        .then(res => {
            setWallet(res.wallet);
            setLoading(false); // Set loading to false after the wallet is set
        })
        .catch(err => {
            setLoading(false); // Also set loading to false if there is an error
            if (err.AR) {
                logout();
            } else {
                alert('An Error has Occurred');
            }
        });
        console.log(wallet)
    }, []);

    const handleButtonClick = (content: React.SetStateAction<string>) => {
        setActiveContent(content); // Update the active content based on the button clicked
    };

    return (
        loading ? <ActivityIncicator /> : (
        <div className="p-p-c">
            <div className="wallet-container">
                <div className="balance-display">
                    {wallet  && wallet.balance ? balanceParser(wallet.balance) : <ActivityIncicator />}
                </div>
                <div className="navigation-buttons">
                    <button onClick={() => handleButtonClick('Income')}>Income</button>
                    <button onClick={() => handleButtonClick('Expenses')}>Expenses</button>
                    <button onClick={() => handleButtonClick('Invoices')}>Invoices</button>
                    <button onClick={() => handleButtonClick('Transactions')}>Transactions</button>
                </div>
                <div className="content-area">
                    {activeContent === 'Income' && <div>{wallet.balance}</div>}
                    {activeContent === 'Expenses' && <div>Expenses Content</div>}
                    {activeContent === 'Invoices' && <div>Invoices Content</div>}
                    {activeContent === 'Transactions' && <div>Transactions Content</div>}
                    {/* Render the content based on the activeContent state */}
                </div>
            </div>
        </div>
        )
        );
};

export default Wallet;
