import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";

import "./Chatmessages.css";

const Chatmessages = ({ message }) => {
  const auth = useAuth();
  const [messageClass, setMessageClass] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const messageClass =
        message?.uid === auth.currentUser.uid ? "sent" : "received";
      setMessageClass(messageClass);
    }
  }, [auth.currentUser]);

  return (
    <div className={`message ${messageClass}`}>
      <p>{message.text}</p>
    </div>
  );
};

export default Chatmessages;
