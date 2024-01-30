import React from "react";
import { Link } from "react-router-dom";
import "./Usercard.css";
import { useAuth } from "../../context/auth/AuthContext";

const Usercard = ({ user }) => {
  const auth = useAuth();
  return (
    <div className="usercard-container">
      <h4>User cards</h4>
      {user.firstName}
      <div className={user.isOnline ? "green-status" : "red-status"} />
      <Link to={`/Chatroom?receiver=${user.firstName} ${user.lastName}`}>
        <p>Chat</p>
      </Link>
      <Link
        to={`/VideoCall?receiver=${user.userID}&caller=${auth.currentUser.uid}`}
      >
        Call
      </Link>
    </div>
  );
};

export default Usercard;
