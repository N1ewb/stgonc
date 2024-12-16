import React, { useState, useEffect } from "react";
import { useCall } from "../../context/call/CallContext";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Profile from "../../static/images/default-profile.png";
import AnswerCall from "../../static/images/icons8-video-call-64.png";
import HangUp from "../../static/images/icons8-hang-up-48.png";

import { useDB } from "../../context/db/DBContext";

const ReceiveCallReq = () => {
  const db = useDB();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const caller = queryParams.get("caller");
  const appointment = queryParams.get("appointment");
  const navigate = useNavigate();
  const call = useCall();
  const callInput = call.callInput;
  const [callerName, setCallerName] = useState();
  const [newCalloffer, setNewCallOffer] = useState();

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
      try {
        await call.updateCallOffer(newCalloffer.id);
        navigate(
          `/private/VideoCall?appointment=${appointment}&receiver=${receiver}&caller=${caller}`
        );
      } catch (error) {
        console.error("Error answering the call:", error);
      }
    }
  };

  const handlehangUp = async () => {
    await call.hangUp();
  };

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await call.subscribeToNotAnsweredOfferChanges('receiver',
        (callback) => {
          navigate(`/private/notAnswered?callOfferId=${callback.id}`);
        }
      );

      return () => {
        unsubscribe();
      };
    };

    fetchData();
  }, [call]);

  useEffect(() => {
    if (newCalloffer && newCalloffer.status === "notAnswered") {
      const cancel = async () => {
        await handlehangUp();
        navigate(`/private/notAnswered`);
      };
      cancel();
    }
  }, [newCalloffer && newCalloffer.status]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallChanges(
          async (newCallOffers) => {
            callInput.current.value = newCallOffers.callID;
            console.log(newCallOffers);
            setNewCallOffer(newCallOffers);
            handleGetCaller();
          },
          "calling"
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
      <div className="w-full h-[100vh] bg-black flex flex-col [&_p]:text-white [&_span]:text-white [&_p]:m-0 items-center justify-around">
        <div className=" flex flex-col w-full justify-center items-center ">
          <p>Incoming Call</p>
          <img
            src={Profile}
            alt="profile-picture"
            className="h-[180px] w-[180px] xsm:w-[50px] xsm:h-[50px]"
          />
          <p>
            {callerName && callerName.firstName + " " + callerName.lastName} is
            calling you
          </p>
          <span>The call will start as soon as accept</span>
        </div>
        <div className="cam-button [&_button]:bg-transparent hover:[&_button]:bg-transparent">
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
