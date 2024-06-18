import React, { useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Profile from "../../static/images/default-profile.png";
import AnswerCall from "../../static/images/icons8-video-call-64.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import "./ReceiveCallReq.css";
import { useDB } from "../../context/db/DBContext";

const ReceiveCallReq = () => {
  const db = useDB();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const navigate = useNavigate();
  const call = useCall();
  const callInput = call.callInput;
  const [callerName, setCallerName] = useState();
  const [newCalloffer, setNewCallOffer] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallOfferChanges(
          (newCallOffers) => {
            callInput.current.value = newCallOffers.callID;
            console.log(newCallOffers);
            setNewCallOffer(newCallOffers);
            handleGetCaller();
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  const handleGetCaller = async () => {
    try {
      const callerInfo = await db.getUser(caller);
      if (callerInfo) {
        setCallerName(callerInfo);
      }
    } catch (error) {
      console.error("Failed to fetch caller info:", error);
    }
  };

  const handleAnswerCall = async () => {
    if (newCalloffer) {
      await call.updateCallOffer(newCalloffer.id);
      navigate(`/VideoCall?receiver=${receiver}&caller=${caller}`);
    }
  };

  const handlehangUp = async () => {
    await call.hangUp();
  };

  return (
    <>
      <div className="home-container">
        <div className="caller-details">
          <p>Incoming Call</p>
          <img src={Profile} alt="profile-picture" height="80px" />
          <p>
            {callerName && callerName.firstName + " " + callerName.lastName} is
            calling you
          </p>
          <span>The call will start as soon as accept</span>
        </div>
        <div className="cam-button">
          <input
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
          <button onClick={() => handleAnswerCall()}>
            <img src={AnswerCall} alt="answer-call" width="30px" />
          </button>
          <button onClick={() => handlehangUp()}>
            <img src={HangUp} alt="camera" width="30px" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ReceiveCallReq;
