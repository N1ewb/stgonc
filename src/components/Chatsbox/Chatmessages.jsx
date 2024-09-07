import React from "react";
import { useAuth } from "../../context/auth/AuthContext";

import "./Chatmessages.css";

const Chatmessages = ({ message }) => {
  const messageClass =
    message.uid === useAuth().currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default Chatmessages;
