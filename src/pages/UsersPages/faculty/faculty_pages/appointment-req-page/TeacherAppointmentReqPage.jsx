import React, { useEffect, useState } from "react";
import AppointmentReqList from "../../../../../components/appointments/AppointmentReqList";
import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";

import "./TeacherAppointmentReqPage.css";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";

const TeacherAppointmentReqPage = () => {
  const db = useDB();
  const auth = useAuth();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [requestedAppointments, setRequestedAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            "Pending",
            (callback) => {
              setRequestedAppointments(callback);
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


  const handleAcceptAppointment = async (requiredParams) => {
    const {id, receiver, date} = requiredParams
    await db.approveAppointment(id, receiver, date);
    setCurrentAppointment(null);
  };

  const handleDenyAppointment = async (requiredParams) => {
    const {id, receiver, reason} = requiredParams
    await db.denyAppointment(id, receiver, reason);
    setCurrentAppointment(null);
  };

  useEffect(() => {
    setCurrentAppointment(null);
  }, []);

  return (
    <div className="teacher-appointment-request-container w-full">
      <h1 className="text-[#320000]">
        <span className="font-bold">Appointment</span>
        <br></br>
        Requests
      </h1>
      <div className="appointment-request-main-content w-full flex flex-row justify-between">
        <div className="appointment-request-list-container w-[40%] flex flex-row flex-wrap">
          {requestedAppointments && requestedAppointments.length !== 0 ? (
            requestedAppointments.map((appointment, index) => (
              <AppointmentReqList
                key={index}
                appointment={appointment}
                handleDenyAppointment={handleDenyAppointment}
                handleAcceptAppointment={handleAcceptAppointment}
              />
            ))
          ) : (
            <p className="font-bold text-[#320000]">No Appointment Request</p>
          )}
        </div>

        <div
          className={`w-[50%] bg-white shadow-md rounded-[30px] p-10 transition-all ease-in-out duration-300 ${
            currentAppointment
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {currentAppointment && (
            <AppointmentInfo
              currentAppointment={currentAppointment}
              positiveClick={handleAcceptAppointment}
              negativeClick={handleDenyAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAppointmentReqPage;
