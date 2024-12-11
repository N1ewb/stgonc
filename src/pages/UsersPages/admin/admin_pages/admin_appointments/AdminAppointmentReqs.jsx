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

  const handleAcceptAppointment = async (requiredParams) => {
    const { id, receiver, date } = requiredParams;
    await db.approveAppointment(id, receiver, date);
    setCurrentAppointment(null);
  };

  const handleDenyAppointment = async (requiredParams) => {
    const { id, receiver, reason } = requiredParams;
    await db.denyAppointment(id, receiver, reason);
    setCurrentAppointment(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            "Pending",
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
    <div className="admin-appointments-container w-full flex flex-col h-[100%] gap-10">
      <div className="admin-appointment-request-header flex flex-row w-1/2 justify-between items-end">
        <h3 className="text-4xl font-bold">Requests</h3>
        <div className="w-1/2">
          <AdminSearchBar
            datas={appointments}
            setData={setAppointments}
            temp={temp}
            setCurrentPage={() => null}
          />
        </div>
      </div>
      <div className="w-full flex flex-row justify-between items-start h-[100%]">
        <div className="w-1/2 max-h-[90%] overflow-auto pb-3 flex flex-row flex-wrap">
          {appointments && appointments.length ? (
            appointments.map((appointment) =>
              appointment.appointmentStatus === "Pending" &&
              appointment.appointmentFormat !== "Walkin" ? (
                <AppointmentReqList
                  key={appointment.id}
                  handleAcceptAppointment={handleAcceptAppointment}
                  handleDenyAppointment={handleDenyAppointment}
                  appointment={appointment}
                />
              ) : null
            )
          ) : (
            <p>No appointments requests</p>
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
              positiveClick={handleAcceptAppointment}
              negativeClick={handleDenyAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentReqsPage;
