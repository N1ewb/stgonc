import React, { useRef, useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation } from "react-router-dom";

import "./VideoCall.css";

const VideoCall = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");

  const call = useCall();
  const localVideoRef = call.localVideoRef;
  const remoteVideoRef = call.remoteVideoRef;
  const callInput = call.callInput;

  const handleWebcamOn = async () => {
    await call.WebcamOn();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallOfferChanges(
          (newCallOffers) => {
            callInput.current.value = newCallOffers.callID;
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  const handleCallButton = async (receiver, caller, callID) => {
    await call.CallButton();
    await call.offerCall(receiver, caller, callInput.current.value);
  };

  const handleAnswerCall = async () => {
    await call.AnswerCall();
  };

  const handlehangUp = async () => {
    await call.hangUp();
  };

  return (
    <>
      <div className="home-container">
        <div className="local-cam-display">
          <video ref={localVideoRef} autoPlay mute />
        </div>
        <div className="remote-cam-display">
          <video ref={remoteVideoRef} autoPlay mute />
        </div>
        <div className="cam-button">
          <button onClick={() => handleWebcamOn()}>Turn Camera On</button>
          <button onClick={() => handleCallButton(receiver, caller)}>
            Call now
          </button>
          <input ref={callInput} placeholder="Call Input" />
          <button onClick={() => handleAnswerCall()}>Answer Call</button>
          <button onClick={() => handlehangUp()}>Hang now</button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
