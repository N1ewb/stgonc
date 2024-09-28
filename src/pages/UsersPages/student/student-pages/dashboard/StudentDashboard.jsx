import React, { useEffect, useState } from "react";

import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useCall } from "../../../../../context/call/CallContext";
import { useMessage } from "../../../../../context/notification/NotificationContext";
import More from "../../../../../static/images/more-dark.png";
import DefaultProfile from "../../../../../static/images/default-profile.png";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import RequestAppointmentForm from "../../student-components/forms/RequestAppointmentForm";
import InstructorsList from "../../student-components/InstructorsList";
import InstructorInfo from "../../student-components/InstructorInfo";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const notif = useMessage();
  const chat = useChat();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState();
  const [currentInstructor, setCurrentInstructor] = useState();
  const [instructorInfo, setInstructorInfo] = useState(null);
  const [myInfo, setMyInfo] = useState();
  const [show, setShow] = useState(false);

  const toggleShow = (instructor) => {
    setShow(!show);
    setCurrentInstructor(instructor);
  };

  const handleGetMyinfo = async () => {
    if (auth.currentUser) {
      const me = await db.getUser(auth.currentUser.uid);
      setMyInfo(me);
    }
  };

  const handleGetTeachers = async () => {
    const teachers = await db.getTeachers();
    setInstructors(teachers);
  };

  useEffect(() => {
    if (myInfo === undefined) {
      handleGetMyinfo();
    }
  });

  useEffect(() => {
    if (instructors === undefined) {
      handleGetTeachers();
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallChanges(
          (newcalloffers) => {
            navigate(
              `/private/ReceiveCallReq?appointment=${newcalloffers.appointment}&receiver=${auth.currentUser.uid}&caller=${newcalloffers.caller}`
            );
          }, "calling"
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  return (
    <div className="h-[100%] flex flex-col gap-10  w-full">
      <h1 className="text-[#360000] ">
        <span className="font-bold">{myInfo && myInfo.department} </span>{" "}
        <br></br>
        <span>Department Instructors</span>{" "}
      </h1>
      <Link to='/private/Endcallpage'>Go to end call page</Link>
      <div className="flex flex-row w-full h-[100%] justify-between">
        <div className="main h-[85%] w-1/2 ">
          <InstructorsList
            instructors={instructors} 
            More={More}
            DefaultProfile={DefaultProfile}
            setInstructorInfo={setInstructorInfo}
          />
        </div>
        <div
          className={`instructor-info-container w-[45%] transition-all ease-in-out duration-300 ${
            instructorInfo
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {instructorInfo && (
            <InstructorInfo toggleShow={toggleShow} currentInstructor={instructorInfo} setInstructorInfo={setInstructorInfo} />
          )}
        </div>
      </div>

      <RequestAppointmentForm
        instructor={currentInstructor}
        toggleShow={toggleShow} 
        show={show}
        myInfo={myInfo}
      />
    </div>
  );
};

export default StudentDashboard;
