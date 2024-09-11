import React, { useEffect, useRef, useState } from "react";
import Chatmessages from "./Chatmessages";
import Profile from "../../static/images/default-profile.png";
import Loading from "../Loading/Loading";

const Chatbox = ({ auth, db, receiver, setCurrentChatReceiver }) => {
  const dummy = useRef();
  const formValueRef = useRef();
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
    <div className="absolute bottom-2 right-5 z-50 bg-white text-white h-[450px] w-[350px] flex flex-col rounded-t-[10px] shadow-lg ">
      <div className="chatbox-header py-2 px-3 bg-[#320000] flex flex-row w-full justify-between [&_p]:m-0 rounded-t-[10px]">
        <p className="capitalize flex flex-row gap-1 items-center ">
          <img
            className="rounded-full w-[20px] h-[20px]"
            src={Profile}
            alt="profile"
          />{" "}
          {receiver}
        </p>
        <p
          className="cursor-pointer"
          onClick={() => setCurrentChatReceiver(null)}
        >
          X
        </p>
      </div>
      <div className="chatbox-body h-[90%] max-h-[95%] px-2 overflow-y-auto overflow-x-hidden flex flex-col-reverse">
        <div ref={dummy}></div>
        {filterbyParticipants === undefined ? (
          <Loading />
        ) : (
          filterbyParticipants.length > 0 &&
          filterbyParticipants.map((message) => (
            <div className="messages-container  w-[90%]" key={message.id}>
              <Chatmessages message={message} />
            </div>
          ))
        )}
      </div>
      <div className="chatbox-footer w-full flex items-center justify-center p-2">
        <form className="flex flex-row justify-between w-[95%]">
          <input
            className="text-black p-0"
            ref={formValueRef}
            onChange={(e) => e.target.value}
          />
          <button
            className="py-1 px-2 rounded-md bg-[#320000]"
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
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
