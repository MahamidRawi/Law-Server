import React, { useState, useEffect, useContext } from "react";
import { fetchHomePage } from "../actions/main/home.actions";
import { AuthContext } from "../Providers/auth.provider";
import ScrollWindow from "../RC/scroll.window";
import { UserCase, UserInfo } from "../data/types";
import '../styling.css';
import { Link } from "react-router-dom";

interface HomePageResponse {
    userCases: UserCase[];
    userInfo: UserInfo;
}

const Home = () => {
    const [userCases, setUserCases] = useState<UserCase>([]); // Initialize with an empty array
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        fetchHomePage(user).then(res => {
            setUserInfo(res.info.userInfo);
            return setUserCases(res.info.userCases);
        }).catch(err => logout());
    }, []);

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
    
    

    return (
        <div className="header-decoration">
        <div className="p-container">
            {/* {userCases.length > 0 ? <ScrollWindow content={userCases} /> : 
                <div className='testerror'>
                    <p className="alert alert-light text-center">No Cases Found</p>
                    <p className='lnk'>Looks like You have No Ongoing Cases :( <Link className="link" to="/Cases">Find New Cases !</Link></p>
                </div>
            }  */}

            <ScrollWindow type="Case" content={mockCases} />
                
        </div>
        </div>
    );
}

export default Home;
