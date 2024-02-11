import React, {useState, useEffect, useContext} from 'react';
import '../../../wallet.css'
import { Discovery } from '../../../RC/cards.rc';
import ScrollWindow from '../../../RC/scroll.window';
import { useLocation } from 'react-router-dom';
import { ActivityIncicator } from '../../../RC/acitivity.incdicator';
import { getCase } from '../../../actions/main/cases.actions';
import { AuthContext } from '../../../Providers/auth.provider';
interface DiscoveryScreenProps {
    data: any
}

const DiscoveryScreen: React.FC<DiscoveryScreenProps> = ({data}) => {
if (!data) return <ActivityIncicator fullScreen />
    return ( 
        <div className="scroll-wallet ns">
            <ScrollWindow content={data.discoveries} type='Discovery' addS/>
        </div>
    )
}

export default DiscoveryScreen