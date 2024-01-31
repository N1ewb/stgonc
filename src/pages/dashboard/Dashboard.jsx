import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDB } from "../../context/db/DBContext";
import "./Dashboard.css";
import Usercard from "../../components/userscard/Usercard";
import { useAuth } from "../../context/auth/AuthContext";
import { useCall } from "../../context/call/CallContext";

const Dashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const navigate = useNavigate();
  const [userList, setUserList] = useState();
  const [user, setUser] = useState();
  const [callOffer, setCallOffer] = useState();

  const getUsers = async () => {
    const users = await db.getUsers();
    setUserList(users);
  };

  const handleGetUser = async () => {
    const user = await db.getUser();
    setUser(user);
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (userList === undefined) {
      const fetchData = async () => {
        await getUsers();
      };
      fetchData();
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallOfferChanges(
          async (newCallOffers) => {
            console.log("Your are being called");
            
            if(newCallOffers && newCallOffers.callID){
              navigate(
                `/VideoCall?receiver=${newCallOffers.receiver}&caller=${newCallOffers.caller}`
              );
              
              const timeoutId = setTimeout(async () => {
                await call.updateCallOffer(newCallOffers.id)
              }, 3000);
              return () => clearTimeout(timeoutId)
            }
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call, navigate]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>
        Welcome:{" "}
        {auth.currentUser &&
          auth.currentUser.displayName + " " + (user && user.role)}
      </p>
      <div className="users-box">
        <h3>Users:</h3>
        {userList === undefined ? (
          <div className="">Loading</div>
        ) : (
          userList.length > 0 &&
          userList.map((user, index) => (
            <div className="card-wrapper" key={index}>
              <Usercard user={user} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
