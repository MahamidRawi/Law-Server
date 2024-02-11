import React, {useEffect} from 'react';
import '../styling.css'
import { useLocation } from 'react-router-dom';

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
    const location = useLocation();
    useEffect(() => {
        return localStorage.removeItem('LCC');
    }, [location.pathname]);
    return (
        <div className="fc">
            <h1>CQ</h1>
        </div>
    );
}

export default Logo