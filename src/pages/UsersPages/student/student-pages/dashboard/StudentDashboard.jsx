import React, { useEffect, useState } from "react";

import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useCall } from "../../../../../context/call/CallContext";
import { useMessage } from "../../../../../context/notification/NotificationContext";
import More from "../../../../../static/images/more-dark.png";
import DefaultProfile from "../../../../../static/images/default-profile.png";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import RequestAppointmentForm from "../../student-components/forms/RequestAppointmentForm";
import InstructorsList from "../../student-components/InstructorsList";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const notif = useMessage();
  const chat = useChat();
  const navigate = useNavigate();
  const toastMessage = (message) => toast(message);
  const [instructors, setInstructors] = useState();
  const [currentInstructor, setCurrentInstructor] = useState();
  const [appointments, setAppointments] = useState();
  const [acceptedAppt, setAcceptedAppt] = useState();
  const [deniedAppt, setDeniedAppt] = useState();
  const [myInfo, setMyInfo] = useState();
  const [show, setShow] = useState(false);

  const toggleShow = (instructor) => {
    setShow(!show);
    setCurrentInstructor(instructor);
  };

  const handleGetUser = async () => {
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
      handleGetUser();
    }
  });

  useEffect(() => {
    if (instructors === undefined) {
      handleGetTeachers();
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToRequestedAppointmentChanges(
            (newAppointment) => {
              setAppointments(newAppointment);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallOfferChanges(
          (newcalloffers) => {
            navigate(
              `/private/ReceiveCallReq?receiver=${auth.currentUser.uid}&caller=${newcalloffers.caller}`
            );
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [call]);

  const handleRequestEmail = async () => {
    notif
      .sendEmail()
      .then((result) => {
        console.log(result.body);
      })
      .catch((err) => {
        console.log(err.statusCode);
      });
  };

  useEffect(() => {
    if (appointments) {
      const acceptedAppt = appointments.filter(
        (appointment) => appointment.appointmentStatus === "Accepted"
      );
      const deniedAppt = appointments.filter(
        (appointment) => appointment.appointmentStatus === "Denied"
      );
      setAcceptedAppt(acceptedAppt);
      setDeniedAppt(deniedAppt);
    }
  }, [appointments]);

  return (
    <div className="h-[100%] flex flex-col gap-10 w-full">
      {/* <p className="text-[#360000] capitalize text-4xl">
        <span className="font-bold ">Welcome </span>{" "}
        {auth.currentUser && auth.currentUser.displayName}
      </p> */}
      <div className="flex flex-row w-full h-[100%]">
        <div className="CCS-instructors-container text-4xl flex flex-col gap-[10px]  w-[50%]">
          {/* <button onClick={() => handleRequestEmail()}>EMAIL ME</button> */}
          <div className="flex flex-col h-[100%] w-full ">
            <div className="flex flex-col gap-[8px]">
              <p className="text-[#360000] ">
                <span>{myInfo && myInfo.department} </span> <br></br>
                <span className="font-bold">Department Instructors</span>{" "}
              </p>
              <div className="main">
                <InstructorsList
                  instructors={instructors}
                  toggleShow={toggleShow}
                  More={More}
                  DefaultProfile={DefaultProfile}
                />
              </div>
            </div>
          </div>
        </div>
        {appointments && (
          <RequestAppointmentForm
            instructor={currentInstructor}
            toggleShow={toggleShow}
            show={show}
            myInfo={myInfo}
            appointments={appointments}
          />
        )}

        <div className="flex flex-col w-[50%] p-10 bg-[#F2F2F2] rounded-[30px] h-[30vh] ">
          <h1 className="text-[#360000] text-3xl font-bold">Appointments</h1>
          <div className="appointment-wrappers w-full flex flex-col justify-center h-[100%]">
            {acceptedAppt && acceptedAppt.length !== 0
              ? acceptedAppt.map((appt, index) => (
                  <div
                    key={index}
                    className="text-[#360000] flex flex-row items-center [&_p]:m-0 justify-between"
                  >
                    <p className="text-2xl">
                      {appt.appointedTeacher.teacherDisplayName}
                    </p>
                    <button
                      className=""
                      onClick={() =>
                        chat.setCurrentChatReceiver(appt.appointedTeacher)
                      }
                    >
                      Chat
                    </button>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
