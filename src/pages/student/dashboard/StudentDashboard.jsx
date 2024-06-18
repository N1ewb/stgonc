import React, { useEffect, useState } from "react";

import "./StudentDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import RequestAppointmentForm from "../../../components/forms/RequestAppointmentForm";
import { Toaster, toast } from "react-hot-toast";
import { useCall } from "../../../context/call/CallContext";
const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState();
  const [appointments, setAppointments] = useState();
  const [myInfo, setMyInfo] = useState();
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);

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

  const handleRequestAppointment = async (
    teacheruid,
    teacherFirstName,
    teacherLastName,
    teacherPhoneno,
    teacheruserID,
    date,
    isOnline,
    phoneno,
    studentIDnumber
  ) => {
    await db.sendAppointmentRequest(
      teacheruid,
      teacherFirstName,
      teacherLastName,
      teacherPhoneno,
      teacheruserID,
      date,
      isOnline,
      phoneno,
      studentIDnumber
    );
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
  }, []);

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

  return (
    <div className="student-dashboard-container">
      <div className="">
        <h3>Student Dashboard</h3>
        <Toaster />
        <select>
          <option></option>
          <option>Department Counseling</option>
          <option>Career & Guidance Counseling</option>
        </select>
        <div className="CCS-instructors-container">
          <p>Department Instructors</p>
          {instructors && instructors.length !== 0 ? (
            instructors.map((instructor, index) => (
              <div
                className="CCS-instructor-cards-container"
                key={instructor.userID}
              >
                <p>
                  {instructor.firstName} {instructor.lastName}
                </p>
                <p>{instructor.email}</p>
                <Button variant="primary" onClick={() => toggleShow()}>
                  Request Appointment
                </Button>
                <RequestAppointmentForm
                  instructor={instructor}
                  toggleShow={toggleShow}
                  show={show}
                />
              </div>
            ))
          ) : (
            <div className="">No instructors</div>
          )}
        </div>
        <div className="">
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
              <div className=""></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
