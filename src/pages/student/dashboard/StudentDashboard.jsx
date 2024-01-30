import React, { useEffect, useState } from "react";

import "./StudentDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const [instructors, setInstructors] = useState();
  const [appointments, setAppointments] = useState();

  const handleGetTeachers = async () => {
    const teachers = await db.getTeachers();
    console.log(teachers);
    setInstructors(teachers);
  };

  const handleGetAppointmentRequest = async () => {
    const appointmentReq = await db.getAppointmentRequests();
    setAppointments(appointmentReq);
  };

  const handleRequestAppointment = async (teacheruid, date, isOnline) => {
    await db.sendAppointmentRequest(teacheruid, date, isOnline);
  };

  useEffect(() => {
    if (appointments === undefined) {
      handleGetAppointmentRequest();
    }
  });

  useEffect(() => {
    if (instructors === undefined) {
      handleGetTeachers();
    }
  });

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
                <p>{instructor.displayName}</p>
                <p>{instructor.email}</p>
                <button
                  onClick={() =>
                    handleRequestAppointment(instructor.email, 2021, true)
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
          <div className="appointment-wrappers"></div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
