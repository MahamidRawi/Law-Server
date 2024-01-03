import React, {useState, useEffect} from 'react';
import './wallet.css';
import { ActivityIncicator } from '../../RC/acitivity.incdicator';
import { RecordCard } from './wallet.cards';
import ScrollWindow from '../../RC/scroll.window';

type incomeParams = {
    from: string, 
    amount: number,
    date: Date, 
    senderId: string,
}

interface IncomeProps {
    recordList: Array<incomeParams> 
    type: 'Income' | 'Expense'
}

interface ExpenseProps {

}

const RecordsScreen: React.FC<IncomeProps> = ({recordList, type}) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        if (recordList) setLoading(false);
    }, [recordList])

    return (
        loading ? <ActivityIncicator fullScreen /> : (
            <div className='scroll-wallet'>
                {recordList.length === 0 ? <h2 className='ct'>No Records... Yet !</h2> : recordList.map((record, idx) => (
                    <RecordCard type={type} key={idx} data={record} />
                ))}
            </div>
        )
    )
}

export {RecordsScreen}