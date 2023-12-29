import React, {useState, useEffect} from 'react';
import './wallet.css';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
import { IncomeCard } from './wallet.cards';
import ScrollWindow from '../../RC/scroll.window';

type incomeParams = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}

interface IncomeProps {
    incomeList: Array<incomeParams> 
}

const IncomeScreen: React.FC<IncomeProps> = ({incomeList}) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (incomeList) setLoading(false);
    }, [incomeList])
    console.warn(incomeList)

    return (
        loading ? <ActivityIncicator fullScreen /> : (
            <div className='scroll-wallet'>
                {incomeList.map(record => (
                    <IncomeCard data={record} />
                ))}
            </div>
        )
    )
}

export {IncomeScreen}