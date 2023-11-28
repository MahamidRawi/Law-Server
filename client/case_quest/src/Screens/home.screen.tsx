import React, {useState, useEffect} from "react";
import { fetchHomePage } from "../actions/main/home.actions";

interface UserCase {
    // Define the structure of a user case here
  }
  
  interface UserInfo {
    // Define the structure of user info here
  }

interface HomePageResponse {
    userCases: UserCase[];
    userInfo: UserInfo;
  }


const Home = () => {
    const [userCases, setUserCases] = useState<UserCase>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>({});

    useEffect(() => {
        console.log('called')
        fetchHomePage().then(res => {
            console.log('reached here')
            setUserInfo(res.info.userInfo);
            setUserCases(res.info.userCases);
        })
      }, []);
    return (
        <div>
            <br />
            <br /><br />
            <button onClick={() => {console.log(userInfo)}}>Render</button>
            {/* This is not the home page */}
        </div>
    )
}

export default Home;