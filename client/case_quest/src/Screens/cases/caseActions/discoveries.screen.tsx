import React, {useState, useEffect} from 'react';
import '../../../wallet.css'
import { Discovery } from '../../../RC/cards.rc';
import ScrollWindow from '../../../RC/scroll.window';
interface DiscoveryScreenProps {
    data: any
}

const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({data}) => {
   console.log(data)
    return (
        <div className="scroll-wallet ns">
            <ScrollWindow content={data.discoveries} type='Discovery' addS />
        </div>
    )
}

export default DiscoveryScreen