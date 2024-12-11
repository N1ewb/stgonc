import React, { useState, useEffect, useRef } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation, useNavigate } from "react-router-dom";

import Camera from "../../static/images/icons8-camera-64.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import "./VideoCall.css";

const VideoCall = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  // const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const appointmentID = queryParams.get("appointment");
  const [newCalloffer, setNewCallOffer] = useState(null);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const call = useCall();
  const {
    callState,
    answerCallOffer,
    hangUp,
    toggleMic,
    localVideoRef,
    remoteVideoRef,
    callInput, 
    toggleReceiverCamera,
    toggleRecieverMic
  } = call;

  const handleAnswerCall = async () => {
    if (newCalloffer && callState !== "connected") {
      try {
        await answerCallOffer(newCalloffer);
      } catch (error) {
        console.log("Error answering call offer:", error.message);
      }
    }
  };

  const handleHangUp = async () => {
    if (newCalloffer ) {
      console.log("Ending call for offer:", newCalloffer);
      try {
        await hangUp(newCalloffer);
        console.log("Call ended successfully");
        setIsCallEnded(true);
        console.log('Call state: ', call.callState)
        if (caller) {
          navigate(
            `/private/Endcallpage?appointment=${appointmentID}&caller=${caller}`
          );
        }
      } catch (error) {
        console.error("Error hanging up the call:", error.message);
      }
    }
  };

  useEffect(() => {
    console.log("call.callState changed:", call.callState);
    if (call.callState === 'disconnected') {
      async function hangup() {
        await handleHangUp();
      }
      hangup();
    }
  }, [call.callState]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = await call.subscribeToCallChanges((callback) => {
          if (callback) {
            if (callInput.current) {
              callInput.current.value = callback.callID;
              setNewCallOffer(callback.id);
            }
          }
        }, "responded");
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  useEffect(() => {
    if (newCalloffer && callState === "idle") {
      handleAnswerCall();
    }
  }, [newCalloffer, callState]);

  return (
    <>
      <div className="home-container">
        <div className="v-local-cam-display">
          {localVideoRef ? <video ref={localVideoRef} autoPlay muted /> : <img src="" alt="placeholder" className="w-[500px] h-[250px] bg-[#4f4f4f] rounded-md" />}
        </div>
        <div className="v-remote-cam-display">
        {remoteVideoRef ? <video ref={remoteVideoRef} autoPlay muted /> : <img src="" alt="placeholder" className="w-full h-full bg-[#4f4f4f] rounded-md" />}
        </div>
        <div className="call-buttons">
          <button onClick={toggleReceiverCamera}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          <input
            name="call-input"
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
          <button onClick={toggleRecieverMic}>Mute</button>
          <button onClick={handleHangUp}>
            <img src={HangUp} alt="hang up" width="30px" />
          </button>
          <button
            onClick={handleAnswerCall}
            disabled={callState === "connecting" || callState === "connected"}
          >
            {callState === "connecting"
              ? "Connecting..."
              : callState === "connected"
              ? "Connected"
              : "Answer Call"}
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
