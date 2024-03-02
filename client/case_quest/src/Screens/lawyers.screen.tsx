import React, {useState, useEffect, useContext} from 'react';
import { getLawyers } from '../actions/main/lawyers.actions';
import { UserInfo } from '../data/types';
import { AuthContext } from '../Providers/auth.provider';
import ScrollWindow from '../RC/scroll.window';

interface LawyersProps {

}

const Lawyers: React.FC<LawyersProps> = () => {
    const {logout} = useContext(AuthContext);
    const [lawyers, setLawyers] = useState<UserInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    useEffect(() => {
        getLawyers().then(res => {setLawyers(res.lawyers); console.log(res.lawyers)}).catch(err => logout());
        return
    }, []);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredLawyers = lawyers.filter(lawyer =>
        `${lawyer.firstName} ${lawyer.lastName}`.toLowerCase().includes(searchTerm) ||
        lawyer.username.toLowerCase().includes(searchTerm) ||
        lawyer.email.toLowerCase().includes(searchTerm)
    );
    return (
        <div>
        <div className="searchbar">
        <input type="text" className='searchinput' placeholder="Search for lawyers" onChange={handleSearchChange} />
        </div>
        <div className="p-container">
            <ScrollWindow type='User' content={filteredLawyers} />
        </div>
    </div>
    )
}

export default Lawyers