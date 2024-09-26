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
  const [callAnswered, setCallAnswered] = useState(false); 

  const call = useCall();
  const callInput = call.callInput;

  const handleAnswerCall = async () => {
    if (newCalloffer) { 
      try {
        console.log(`Answering call offer: ${newCalloffer}`);

        await call.answerCallOffer(newCalloffer);
        await call.AnswerCall();
        
      } catch (error) {
        console.log("Error answering call offer:", error.message);
      }
    }
  };

  const handleHangUp = async () => {
    if (newCalloffer !== null) {
      await call.hangUp(newCalloffer);
    } else {
      console.log("Error: newCalloffer is null.");
    }
  };

  useEffect(() => {
    setLocalVideoRef(call.localVideoRef);
    setRemoteVideoRef(call.remoteVideoRef);
  }, [call.localVideoRef, call.remoteVideoRef]);

  useEffect(() => {
    const answerCallOnce = async () => {
      if (newCalloffer && call.remoteStream && !callAnswered) {
        setCallAnswered(true); 
        console.log('Remote stream called in video call: ',call.remoteStream)
        await handleAnswerCall(); 
      }
    };
    answerCallOnce();
}, [newCalloffer, call.remoteStream]);


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
          <button onClick={call.toggleCamera}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          <input
            name="call-input"
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
          <button onClick={call.toggleMic}>Mute</button>
          <button onClick={handleHangUp}>
            <img src={HangUp} alt="hang up" width="30px" />
          </button>
          <button onClick={handleAnswerCall}>Answer Call</button>
        </div>
      </div>
    </>
  );
};

export default VideoCall;
