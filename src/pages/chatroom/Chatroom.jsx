import React, { useEffect, useRef, useState } from "react";

import Chatmessages from "../../components/Chatsbox/Chatmessages";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";

import "./Chatroom.css";
import { Link } from "react-router-dom";

const Chatroom = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const dummy = useRef();
  const auth = useAuth();
  const db = useDB();
  const formValueRef = useRef();
  const [receiver, setReceiver] = useState(urlParams.get("receiver"));
  const [messages, setMessages] = useState();
  const [filterbyParticipants, setFilterbyParticipants] = useState();

  const handleGetMessages = async (receiver) => {
    const messages = await db.getMessages(receiver);
    setMessages(messages);
  };

  const filterParticipants = async () => {
    if (auth.currentUser) {
      if (messages) {
        const filtered = messages.filter(
          (message) =>
            message.participants.includes(auth.currentUser.displayName) &&
            message.participants.includes(receiver)
        );
        setFilterbyParticipants(filtered);
      }
    }
  };

  useEffect(() => {
    if (filterbyParticipants === undefined) {
      filterParticipants();
    }
  });

  useEffect(() => {
    if (messages === undefined) {
      handleGetMessages(receiver);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToMessageChanges((newmessages) => {
            setMessages(newmessages);
            setFilterbyParticipants();
            filterParticipants();
            if (dummy.current) {
              dummy.current.scrollIntoView({ behavior: "smooth" });
            }
          }, receiver);
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [receiver, auth.currentUser, db]);

  const handleSendMessage = async (formValue, uid, receiver) => {
    if (auth.currentUser) {
      await db.sendMessage(formValue, uid, receiver);
    }

    formValueRef.current.value = "";
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="chatroom-container">
      <Link to="/auth/Login">Back to Dashboard</Link>
      <div className="chat-receiver">{receiver}</div>
      <div className="messages-wrapper">
        <div ref={dummy}></div>
        {filterbyParticipants === undefined ? (
          <div className="">Loading</div>
        ) : (
          filterbyParticipants.length > 0 &&
          filterbyParticipants.map((message) => (
            <div className="messages-container" key={message.id}>
              <Chatmessages message={message} />
            </div>
          ))
        )}
      </div>
      <form>
        <input ref={formValueRef} onChange={(e) => e.target.value} />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            handleSendMessage(
              formValueRef.current.value,
              auth.currentUser.uid,
              receiver
            );
          }}
        >
          Sends
        </button>
      </form>
    </div>
  );
};

export default Chatroom;
