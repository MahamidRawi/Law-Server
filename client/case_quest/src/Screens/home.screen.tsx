import React, { useState, useEffect, useContext } from "react";
import { fetchHomePage } from "../actions/main/home.actions";
import { AuthContext } from "../Providers/auth.provider";
import ScrollWindow from "../RC/scroll.window";
import { UserCase, UserInfo } from "../data/types";
import '../styling.css';
import '../wallet.css';
import { Link, useNavigate } from "react-router-dom";
import { ActivityIncicator } from "../RC/acitivity.incdicator";

const Home = () => {
    const [userCases, setUserCases] = useState<UserCase>([]); // Initialize with an empty array
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const { user, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchHomePage(user).then(res => {
            setUserInfo(res.info.userInfo);
            setUserCases(res.info.userCases);
            return setLoading(false);
        }).catch(err => logout());
    }, []);

    
    
    const handleButtonClick = () => {
        return navigate('/NewCase');
    }
    const mockCases = [
        {
            _id: "5f50c31e1c9d44000047fb60",
            title: "John Doe Legal Firm vs State Prosecution",
            defense: "John Doe Legal Firm",
            prosecution: "State Prosecution",
            summary: "Case of alleged tax fraud involving a major corporation.",
            participants: ["John Doe", "Jane Smith"],
            difficulty: "High",
            owners: ["ownerId1", "ownerId2"]
        },
        {
            _id: "5f50c3291c9d44000047fb61",
            title: "ACME Law Services vs Federal Prosecution",
            defense: "ACME Law Services",
            prosecution: "Federal Prosecution",
            summary: "Intellectual property dispute between two tech companies.",
            participants: ["Alice Johnson", "Bob Brown"],
            difficulty: "Medium",
            owners: ["ownerId3", "ownerId4"]
        },
        {
            _id: "5f50c3311c9d44000047fb62",
            title: "Quick Law Associates vs City of Newburg",
            defense: "Quick Law Associates",
            prosecution: "City of Newburg",
            summary: "Personal injury case from a public transportation accident.",
            participants: ["Clara Oswald", "Danny Pink"],
            difficulty: "Low",
            owners: ["ownerId5", "ownerId6"]
        }
        // ... more cases can be added in the same format
    ];

    const tCase = []

    return (
        <div>
            {tCase.length <= 0 && <div className="searchbar d-flex flex-column hp">
            <button type="button" className="searchbutton" onClick={() => navigate('/NewCase')}>+ Find New Case</button>
             <p className="alert alert-light text-center mt-5">No Ongoing Cases Currently... Find New Cases :)</p>
        </div>
}
        <div className={`p-container ${tCase.length > 0 ? 'cp' : 'restrain'}`}>
            {tCase?.length > 0 && <ScrollWindow center="c-sw" type='Case' content={[]} />} 
                
        </div>
        </div>           
    );
}

export default Home;

