import React, { useEffect, useRef, useState } from "react";
import Chatmessages from "./Chatmessages";
import Profile from "../../static/images/default-profile.png";
import Loading from "../Loading/Loading";
import AttachFile from "../../static/images/attach-file.png";
import { useMessage } from "../../context/notification/NotificationContext";
import toast from "react-hot-toast";

const Chatbox = ({ auth, db, receiver, setCurrentChatReceiver }) => {
  const notif = useMessage();
  const dummy = useRef();
  const formValueRef = useRef();
  const toastMessage = (message) => toast(message);
  const [messages, setMessages] = useState();
  const [filterbyParticipants, setFilterbyParticipants] = useState();

  const getParticipantName = (receiver) => {
    return (
      receiver?.displayName ||
      `${receiver?.firstName} ${receiver?.lastName}` ||
      receiver?.teacherDisplayName ||
      receiver?.teacherName ||
      "Unknown"
    );
  };

  const getParticipantEmail = (receiver) => {
    return receiver?.email || receiver?.teacheremail || "Unknown";
  };

  const handleGetMessages = async (receiver) => {
    const participantName = getParticipantName(receiver);
    const messages = await db.getMessages(participantName);
    setMessages(messages);
  };

  useEffect(() => {
    const filterParticipants = async () => {
      if (auth.currentUser && messages) {
        const participantName = getParticipantName(receiver);
        const filtered = messages.filter(
          (message) =>
            message.participants.includes(auth.currentUser.displayName) &&
            message.participants.includes(participantName)
        );
        setFilterbyParticipants(filtered);
      }
    };
    filterParticipants();
  }, [messages]);

  useEffect(() => {
    if (messages === undefined) {
      handleGetMessages(receiver);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const participantName = getParticipantName(receiver);
          const unsubscribe = db.subscribeToMessageChanges((newmessages) => {
            setMessages(newmessages);
            setFilterbyParticipants();

            if (dummy.current) {
              dummy.current.scrollIntoView({ behavior: "smooth" });
            }
          }, participantName);
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [receiver, auth.currentUser, db]);

  const handleSendMessage = async (formValue, receiver) => {
    if (auth.currentUser) {
      const participantName = getParticipantName(receiver);
      const participantEmail = getParticipantEmail(receiver);

      const res = await db.sendMessage(
        formValue,
        auth.currentUser.uid,
        participantName
      );
      if (res.status === "success") {
        console.log("res message", res.message);
        toastMessage(res.message);
      } else {
        console.log("res message", res.message);
        toastMessage(res.message);
      }
      // await notif.storeUserNotifToDB(
      //   auth.currentUser.email,
      //   participantEmail,
      //   "Message",
      //   `${auth.currentUser.displayName} has sent you a message!`
      // );
    }

    formValueRef.current.value = "";
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAttachFile = async (e) => {
    const file = e.target.files[0];
    try {
      if (file && auth.currentUser) {
        const participantName = getParticipantName(receiver);
        const participantEmail = getParticipantEmail(receiver);
        await db.attachFile(file, auth.currentUser.uid, participantName);
        await notif.storeUserNotifToDB(
          auth.currentUser.email,
          participantEmail,
          "Message",
          `${auth.currentUser.displayName} has sent you an attachment!`
        );
      }
    } catch (error) {
      toastMessage("Error in attaching file", error.message);
    }
  };

  return (
    <div className="absolute bottom-3 right-5 z-50 bg-white text-white h-[450px] w-[350px] flex flex-col rounded-t-[10px] shadow-lg">
      <div className="chatbox-header py-2 px-3 bg-[#320000] flex flex-row w-full justify-between [&_p]:m-0 rounded-t-[10px]">
        <p className="capitalize flex flex-row gap-1 items-center ">
          <img
            className="rounded-full w-[20px] h-[20px]"
            src={Profile}
            alt="profile"
          />{" "}
          {getParticipantName(receiver)}
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
            <div className="messages-container w-[90%]" key={message.id}>
              <Chatmessages message={message} />
            </div>
          ))
        )}
      </div>
      <div className="chatbox-footer w-full flex items-center justify-center p-2">
        <label className="cursor-pointer flex items-center">
          <img src={AttachFile} alt="attach file" className="w-6 h-6 mr-2" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleAttachFile(e)}
          />
        </label>

        <form className="flex flex-row justify-between w-[95%]">
          <input
            className="text-black p-2"
            ref={formValueRef}
            onChange={(e) => e.target.value}
          />
          <button
            className="py-1 px-2 rounded-md bg-[#320000]"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSendMessage(formValueRef.current.value, receiver);
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
