import React, { useEffect, useState } from "react";

import "./StudentDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RequestAppointmentForm from "../../../components/forms/RequestAppointmentForm";
import { Toaster, toast } from "react-hot-toast";
import { useCall } from "../../../context/call/CallContext";
import Profile from "../../../components/userProfile/Profile";
import { useMessage } from "../../../context/notification/NotificationContext";
import More from "../../../static/images/more.png";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const notif = useMessage();
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
              `/ReceiveCallReq?receiver=${auth.currentUser.uid}&caller=${newcalloffers.caller}`
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
    <div className="student-dashboard-container flex flex-row bg-[#360000] h-screen w-full [&_p]:m-0">
      <div className="student-sidebar h-[100%] flex flex-col mt-[100px] gap-[40px] items-center w-[17%]">
        <Profile />
      </div>
      <div className="student-main-content flex flex-col bg-white w-[83%] max-h-[90vh] h-[90vh] mt-[83px] p-[50px] rounded-tl-[70px] rounded-bl-[70px] lg:rounded-bl-[0px] lg:rounded-tl-[0px]">
        <p className="text-[#360000] capitalize text-4xl">
          <span className="font-bold ">Welcome </span>{" "}
          {auth.currentUser && auth.currentUser.displayName}
        </p>
        <div className="flex flex-row w-full h-[100%]">
          <div className="CCS-instructors-container text-4xl flex flex-col gap-[10px]  w-[50%]">
            {/* <button onClick={() => handleRequestEmail()}>EMAIL ME</button> */}
            <div className="flex flex-col h-[100%] w-full ">
              <div className="spacer h-[20%]"></div>
              <div className="flex flex-col gap-[8px]">
                <p className="text-[#360000] ">
                  <span>Department</span> <br></br>
                  <span className="font-bold">Instructors</span>{" "}
                </p>
                {instructors && instructors.length !== 0 ? (
                  instructors.map((instructor, index) => (
                    <div
                      className="CCS-instructor-cards-container w-full flex flex-row justify-between items-center text-[15px]"
                      key={index}
                    >
                      <p className="w-[50%] text-[#360000]">
                        {instructor.firstName} {instructor.lastName}
                      </p>

                      <button
                        className="bg-[#360000] rounded-[4px] px-6 py-[2px] hover:bg[#323232]"
                        onClick={() => toggleShow(instructor)}
                      >
                        Request Appointment
                      </button>
                      <button className="bg-transparent">
                        <img src={More} alt="more" width={25} height={25} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="">No instructors</div>
                )}
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
                ? acceptedAppt.map((appt) => (
                    <div className="text-[#360000] flex flex-row items-center [&_p]:m-0 justify-between">
                      <p className="text-2xl">
                        {appt.appointedTeacher.teacherDisplayName}
                      </p>
                      <Link
                        className=" text-[#360000] no-underline text-2xl"
                        to={`/Chatroom?receiver=${appt.appointedTeacher.teacherDisplayName} `}
                      >
                        Chat
                      </Link>
                    </div>
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
