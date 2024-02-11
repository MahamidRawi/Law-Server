import React, {useState, useEffect} from 'react';
import '../../../wallet.css'
import ScrollWindow from '../../../RC/scroll.window';

interface ParticipantsProps {
    data?: any
}

const Participants: React.FC<ParticipantsProps> = ({data}) => {

    return (
        <div className="scroll-wallet ns">
            <ScrollWindow pt type='User' content={data.participants} addS />
        </div>
    )
}

export default Participants