import React, { useState, useEffect, useRef } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation, useNavigate } from "react-router-dom";

import Profile from "../../static/images/default-profile.png";
import Camera from "../../static/images/icons8-camera-64.png";
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

  const [newCallOffer, setNewCallOffer] = useState();
  const [localVideoRef, setLocalVideoRef] = useState(null);
  const [remoteVideoRef, setRemoteVideoRef] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const call = useCall();
  const callInput = call.callInput;

  // Track if a call has already been initiated to prevent multiple offers
  const callInitiatedRef = useRef(false);

  const handleCallButton = async () => {
    if (callInitiatedRef.current) return;  // Prevent multiple calls
    try {
      setConnecting(true);
      callInitiatedRef.current = true;  // Mark that the call is initiated
      console.log("pressed call button");

      await call.CallButton();
      await call.offerCall(receiver, caller, callInput.current.value);
    } catch (error) {
      console.log(error.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleHangUp = async (newCallOffer) => {
    try {
      await call.hangUp(newCallOffer);
      callInitiatedRef.current = false; 
      navigate("/auth/Login");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setLocalVideoRef(call.localVideoRef);
    setRemoteVideoRef(call.remoteVideoRef);
  }, [call.localVideoRef, call.remoteVideoRef]);

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

  // Auto-call once on load if receiver exists and call hasn't been initiated
  useEffect(() => {
    if (receiver && !callInitiatedRef.current) {
      handleCallButton();
    }
  }, [receiver]);

  return (
    <>
      <div className="home-container">
        <div
          className="remote-cam-display"
          style={{
            display:
              newCallOffer && newCallOffer.status === "answered"
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
              newCallOffer && newCallOffer.status === "answered"
                ? "none"
                : "flex",
          }}
        >
          <img src={Profile} alt="profile" height="70px" />
          <h4>{auth.currentUser?.displayName}</h4>
          {connecting ? <p>Connecting to network</p> : <p>Dialing the user</p>}
        </div>

        <div className="local-cam-display">
          <video ref={localVideoRef} autoPlay muted />
        </div>

        <div className="action-buttons">
          <button onClick={() => call.toggleCamera()}>
            <img src={Camera} alt="camera" width="30px" />
          </button>
          {newCallOffer && newCallOffer.status === "answered" ? (
            <button onClick={() => call.toggleMic()}>Mute</button>
          ) : (
            ""
          )}
          <button onClick={() => handleHangUp(newCallOffer)}>
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
