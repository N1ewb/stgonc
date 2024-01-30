import React, { useEffect, useState } from "react";

import "./TeacherDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";

const TeacherDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const [appointments, setAppointments] = useState();

  const handleAcceptAppointment = async (id) => {
    await db.approveAppointment(id);
  };

  const handleDenyAppointment = async () => {};

  const handleGetAppointments = async (email) => {
    const appointment = await db.getAppointmentRequests(email);
    setAppointments(appointment);
    console.log("setted", appointments);
  };

  useEffect(() => {
    if (appointments === undefined) {
      handleGetAppointments(auth.currentUser.email);
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges((callback) => {
            setAppointments(callback);
          });
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="teacher-dashboard-container">
      <div className="">
        <h3>Teachers Dashboard</h3>
        <div className="appointments-container">
          {appointments && appointments.length !== 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="appoinment-card">
                <p>Cosultation Appointment Requested By:</p>
                <p>{appointment.appointee}</p>
                <p>{appointment.appointmentType}</p>
                <p>{appointment.appointmentStatus}</p>
                <div className="teacher-action">
                  {appointment.appointmentStatus !== "Accepted" ? (
                    <>
                      <button
                        onClick={() => handleAcceptAppointment(appointment.id)}
                      >
                        Accept
                      </button>
                      <button onClick={() => handleDenyAppointment()}>
                        Deny
                      </button>
                    </>
                  ) : (
                    <div className="">
                      <button>hello</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="">
              <p>No Appointments</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
