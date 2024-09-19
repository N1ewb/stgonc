import React, { useEffect, useState } from "react";

import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";

import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";
import AppointmentReqList from "../../../../../components/appointments/AppointmentReqList";
import AdminSearchBar from "../../admin-components/AdminSearchBar";

const AdminAppointmentReqsPage = () => {
  const db = useDB();
  const auth = useAuth();
  const chat = useChat();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [appointments, setAppointments] = useState();
  const [temp, setTemp] = useState();

  const handleAcceptAppointment = async (id, receiver, date) => {
    await db.approveAppointment(id, receiver, date);
    setCurrentAppointment(null);
  };

  const handleDenyAppointment = async (id, receiver, date) => {
    await db.denyAppointment(id, receiver, date);
    setCurrentAppointment(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            "pending",
            (callback) => {
              setAppointments(callback);
              setTemp(callback);
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
    setCurrentAppointment(null);
  }, []);

  return (
    <div className="admin-appointments-container w-full flex flex-col">
      <div className="admin-appointment-request-header flex flex-row w-1/2 justify-between items-end">
        <h3 className="text-4xl font-bold">
          Appointment <br></br> <span className="font-light">Requests</span>
        </h3>
        <AdminSearchBar
          datas={appointments}
          setData={setAppointments}
          temp={temp}
        />
      </div>
      <div className="w-full flex flex-row justify-between items-start">
        <div className="w-1/2">
          {appointments && appointments.length ? (
            appointments.map((appointment, index) =>
              appointment.appointmentStatus === "pending" ? (
                <AppointmentReqList
                  key={index}
                  appointment={appointment}
                  setCurrentChatReceiver={chat.setCurrentChatReceiver}
                />
              ) : null
            )
          ) : (
            <p>No accepted appointments yet</p>
          )}
        </div>

        <div
          className={`w-[45%] bg-white shadow-md rounded-[30px] p-10 transition-all ease-in-out duration-300 ${
            currentAppointment
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {currentAppointment && (
            <AppointmentInfo
              handleAcceptAppointment={handleAcceptAppointment}
              handleDenyAppointment={handleDenyAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentReqsPage;
