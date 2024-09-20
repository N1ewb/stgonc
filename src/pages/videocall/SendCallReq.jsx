import React, { useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation, useNavigate } from "react-router-dom";

import Profile from "../../static/images/default-profile.png";
import Camera from "../../static/images/icons8-camera-64.png";
import CallButton from "../../static/images/icons8-call-64-white.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import "./SendCallReq.css";
import { useAuth } from "../../context/auth/AuthContext";

const SendCallReq = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const [newCalloffer, setNewCallOffer] = useState();
  const [localVideoRef, setLocalVideoRef] = useState(null);
  const [remoteVideoRef, setRemoteVideoRef] = useState(null);

  const call = useCall();
  const callInput = call.callInput;

  const handleWebcamOn = async () => {
    await call.WebcamOn();
  };

  const handleCallButton = async (receiver, caller) => {
    try {
      console.log("pressed call button");
      await call.CallButton();
      await call.offerCall(receiver, caller, callInput.current.value);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlehangUp = async (newCalloffer) => {
    try {
      await call.hangUp(newCalloffer);
      navigate("/auth/Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setLocalVideoRef(call.localVideoRef);
    setRemoteVideoRef(call.remoteVideoRef);
  }, [remoteVideoRef, localVideoRef]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToAnsweredOfferChanges(
          async (newCallOffers) => {
            if (newCallOffers) {
              setNewCallOffer(newCallOffers);
              const timeoutId = setTimeout(async () => {
                await call.updateCallOffer(newCallOffers.id);
              }, 3000);
              return () => clearTimeout(timeoutId);
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
        <div
          className="remote-cam-display"
          style={{
            display:
              newCalloffer && newCalloffer.status === "answered"
                ? "flex"
                : "none",
          }}
        >
          <video ref={remoteVideoRef} autoPlay />
        </div>

        <div
          className="caller-details"
          style={{
            display:
              newCalloffer && newCalloffer.status === "answered"
                ? "none"
                : "flex",
          }}
        >
          <img src={Profile} alt="profile" height="70px" />
          <h4>{auth.currentUser?.displayName}</h4>
          <p>Calling...</p>
        </div>

        <div className="local-cam-display">
          <video ref={localVideoRef} autoPlay muted />
        </div>
        <div className="action-buttons">
          <button onClick={() => handleWebcamOn()}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          <button onClick={() => handleCallButton(receiver, caller)}>
            <img src={CallButton} alt="call button" width="30px" />
          </button>
          <button onClick={() => handlehangUp()}>
            <img src={HangUp} alt="hang up" width="30px" />
          </button>
          <input
            style={{ display: "none" }}
            ref={callInput}
            placeholder="Call Input"
          />
        </div>
      </div>
    </>
  );
};

export default SendCallReq;
