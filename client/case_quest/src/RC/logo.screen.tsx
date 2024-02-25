import React, {useEffect} from 'react';
import '../styling.css'
import { useLocation } from 'react-router-dom';

interface LogoProps {
    name: string
}

const Logo: React.FC<LogoProps> = ({name}) => {
    const location = useLocation();
    useEffect(() => {
        return localStorage.removeItem('LCC');
    }, [location.pathname]);
    return (
        <div className="fc">
            <h1>CQ</h1>
            <h4 className='greeting'>Welcome Back, {name} !</h4>
        </div>
    );
}

export default Logo