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
    const { user, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetchHomePage(user).then(res => {
            setUserCases(res.info.userCases);
            return setLoading(false);
        }).catch(err => logout());
    }, []);

    return (
        loading ? <ActivityIncicator fullScreen /> : (
        <div>
            <div className={`searchbar ${userCases.length == 0 && "d-flex flex-column hp"}`}>
            {userCases.length < 3 && (
                <>
            <button type="button" className="searchbutton" onClick={() => navigate('/NewCase')}>+ Find New Case</button>
            {userCases.length == 0 && <p className="alert alert-light text-center mt-5">No Ongoing Cases Currently... Find New Cases :)</p>}
            </>)}
        </div>
        <div className="p-container">
            {userCases?.length > 0 && <ScrollWindow type='Case' center='c-sw' content={userCases} />}
                
        </div>
        </div>         
        )
    );
}

export default Home;

