import React, { useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation, useNavigate } from "react-router-dom";

import Profile from "../../static/images/default-profile.png";
import Camera from "../../static/images/icons8-camera-64.png";
import CallButton from "../../static/images/icons8-call-64-white.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import "./VideoCall.css";

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const appointmentID = queryParams.get("appointment")
  const [newCalloffer, setNewCallOffer] = useState(null);

  const call = useCall();
  const { callState, answerCallOffer, AnswerCall, hangUp, toggleCamera, toggleMic, localVideoRef, remoteVideoRef, callInput } = call;

  const handleAnswerCall = async () => {
    if (newCalloffer && callState !== 'connected') {
      try {
        await answerCallOffer(newCalloffer);
      } catch (error) {
        console.log("Error answering call offer:", error.message);
      }
    }
  };

  const handleHangUp = async () => {
    if (newCalloffer !== null) {
      console.log("calloffer: ", newCalloffer);
      await hangUp(newCalloffer);
      if (caller) {
        navigate(`/private/Endcallpage?appointment=${appointmentID}&caller=${caller}`);
      }
    } else {
      console.log("Error: newCalloffer is null.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = await call.subscribeToRespondedCallChanges(
          (newCallOffers) => {
            if (newCallOffers) {
              if (callInput.current) {
                callInput.current.value = newCallOffers.callID;
                setNewCallOffer(newCallOffers.id);
              }
            }
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  useEffect(() => {
    if (newCalloffer && callState === 'idle') {
      handleAnswerCall();
    }
  }, [newCalloffer, callState]);

  return (
    <>
      <div className="home-container">
        <div className="v-local-cam-display">
          <video ref={localVideoRef} autoPlay muted />
        </div>
        <div className="v-remote-cam-display">
          <video ref={remoteVideoRef} autoPlay />
        </div>
        <div className="call-buttons">
          <button onClick={toggleCamera}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          <input
            name="call-input"
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
          <button onClick={toggleMic}>Mute</button>
          <button onClick={handleHangUp}>
            <img src={HangUp} alt="hang up" width="30px" />
          </button>
          <button onClick={handleAnswerCall} disabled={callState === 'connecting' || callState === 'connected'}>
            {callState === 'connecting' ? 'Connecting...' : callState === 'connected' ? 'Connected' : 'Answer Call'}
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;