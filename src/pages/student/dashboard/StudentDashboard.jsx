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

  return (
    <div className="student-dashboard-container">
      <div className="student-sidebar">
        <Profile />
      </div>
      <div className="student-main-content">
        <p>Welcome {auth.currentUser && auth.currentUser.displayName}</p>

        <div className="CCS-instructors-container">
          <button onClick={() => handleRequestEmail()}>EMAIL ME</button>
          <p>Department Instructors</p>
          {instructors && instructors.length !== 0 ? (
            instructors.map((instructor, index) => (
              <div className="CCS-instructor-cards-container" key={index}>
                <p>
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p>{instructor.email}</p>

                <Button
                  variant="primary"
                  onClick={() => toggleShow(instructor)}
                >
                  Request Appointment
                </Button>
              </div>
            ))
          ) : (
            <div className="">No instructors</div>
          )}
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
        <p>Appointments</p>
        <div className="appointment-wrappers">
          {appointments && appointments.length !== 0 ? (
            appointments.map((appointment) => (
              <div
                className=""
                style={{ display: "flex", gap: "10px" }}
                key={appointment.id}
              >
                <p>{appointment.appointmentDate}</p>
                <p>
                  {`${appointment.appointmentsTime.appointmentStartTime}:00-
                  ${appointment.appointmentsTime.appointmentEndTime}:00`}
                </p>
                <p>{appointment.appointedTeacher.teacherDisplayName}</p>
                {appointment.appointmentStatus === "Accepted" ? (
                  <>
                    <Link
                      to={`/Chatroom?receiver=${appointment.appointedTeacher.teacherDisplayName} `}
                    >
                      <p>Chat</p>
                    </Link>
                  </>
                ) : (
                  <p>{appointment.appointmentStatus}</p>
                )}
              </div>
            ))
          ) : (
            <div className="">No appointments yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
