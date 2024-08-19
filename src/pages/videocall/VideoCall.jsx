import React, { useRef, useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation } from "react-router-dom";

import Profile from "../../static/images/default-profile.png";
import Camera from "../../static/images/icons8-camera-64.png";
import CallButton from "../../static/images/icons8-call-64-white.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import "./VideoCall.css";

const VideoCall = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const [newCalloffer, setNewCallOffer] = useState(null);
  const [localVideoRef, setLocalVideoRef] = useState();
  const [remoteVideoRef, setRemoteVideoRef] = useState();

  const call = useCall();

  const callInput = call.callInput;

  const handleWebcamOn = async () => {
    await call.WebcamOn();
  };

  const handleAnswerCall = async () => {
    console.log("Pressed answer call");
    if (newCalloffer !== null) {
      try {
        console.log(`Call offer ${newCalloffer}`);
        await call.answerCallOffer(newCalloffer);
        await call.AnswerCall();
      } catch (error) {
        console.log("Call offer is null:", error.message);
      }
    }
  };

  const handlehangUp = async () => {
    if (newCalloffer !== null) {
      await call.hangUp(newCalloffer);
    } else {
      console.log("Error: newCalloffer is null.");
    }
  };

  useEffect(() => {
    setLocalVideoRef(call.localVideoRef);
    setRemoteVideoRef(call.remoteVideoRef);
  }, [remoteVideoRef, localVideoRef]);

  useEffect(() => {
    handleAnswerCall();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToRespondedCallChanges(
          (newCallOffers) => {
            if (newCallOffers) {
              callInput.current.value = newCallOffers.callID;
              setNewCallOffer(newCallOffers.id);
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
          <button onClick={() => handleWebcamOn()}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          <input
            name="call-input"
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
          <button onClick={() => handleAnswerCall()}>Answer Call</button>
          <button onClick={() => handlehangUp()}>
            <img src={HangUp} alt="camera" width="30px" />
          </button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
