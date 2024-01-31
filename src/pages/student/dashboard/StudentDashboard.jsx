import React, { useEffect, useState } from "react";

import "./StudentDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const [instructors, setInstructors] = useState();
  const [appointments, setAppointments] = useState();
  const [myInfo, setMyInfo] = useState();

  const handleGetUser = async () => {
    const me = await db.getUser();
    setMyInfo(me);
    console.log(me);
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

  return (
    <div className="student-dashboard-container">
      <div className="">
        <h3>Student Dashboard</h3>
        <div className="CCS-instructors-container">
          <p>Instructors</p>
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
                <button
                  onClick={() =>
                    handleRequestAppointment(
                      instructor.email,
                      instructor.firstName,
                      instructor.lastName,
                      instructor.phoneNumber,
                      instructor.userID,
                      2021,
                      true,
                      myInfo.phoneNumber,
                      myInfo && myInfo.studentIdnumber
                    )
                  }
                >
                  Request Appointment
                </button>
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
                    <Link
                      to={`/Chatroom?receiver=${appointment.appointedTeacher.teacherDisplayName} `}
                    >
                      <p>Chat</p>
                    </Link>
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
