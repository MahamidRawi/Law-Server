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
        const fetchData = async () => {
            try {
              const res = await fetchHomePage();
              const data: HomePageResponse = (res as any).data; // Correct type assertion
      
              setUserCases(data.userCases);
              setUserInfo(data.userInfo);
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };
      
          fetchData();
      }, []);
    return (
        <div>
            <button onClick={() => {console.log(userInfo)}}>Render</button>
            This is not the home page
        </div>
    )
}

export default Home;