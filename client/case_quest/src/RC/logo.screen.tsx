import React from 'react';
import '../styling.css'

interface LogoProps {}

const Logo: React.FC<LogoProps> = () => {
    return (
        <div className="fc">
            <h1>CQ</h1>
        </div>
    );
}

export default Logo