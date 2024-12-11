import React, { useEffect, useState } from "react";

import AppointmentsList from "../../../../../components/appointments/AppointmentsList";
import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../../admin/admin-components/AdminSearchBar";

const TeacherAppointmentListPage = () => {
  const db = useDB();
  const auth = useAuth();
  const chat = useChat();
  const navigate = useNavigate();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [temp, setTemp] = useState()
  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            "Accepted",
            (callback) => {
              setAcceptedAppointments(callback);
              setTemp(callback)
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

  const handleFinishAppointment = async (requiredParams) => {
    const { id, receiver } = requiredParams;
    navigate(`/private/end-call-page?appointment=${id}&receiver=${receiver}`);
    setCurrentAppointment(null);
  };
  const handleCancelAppointment = async (requiredParams) => {
    const { id } = requiredParams;
    await db.cancelAppointment(id);
    setCurrentAppointment(null);
  };

  return (
    <div className="teacher-appointment-page-list-container w-full flex flex-col">
      <header className="w-1/2 flex justify-between">
        <h1 className="text-[#320000]">
          <span className="font-bold">Upcoming</span>
        </h1>
        <AdminSearchBar
          datas={acceptedAppointments}
          setData={setAcceptedAppointments}
          temp={temp}
          setCurrentPage={() => null}
        />
      </header>
      <div className="appointment-list-main-content w-full flex flex-row justify-between">
        <div className="appointment-list-container gap-2 w-[50%] flex flex-row flex-wrap">
          {acceptedAppointments && acceptedAppointments.length !== 0 ? (
            acceptedAppointments.map((appointment, index) => (
              <AppointmentsList
                key={index}
                appointment={appointment}
                setCurrentChatReceiver={chat.setCurrentChatReceiver}
              />
            ))
          ) : (
            <p className="font-bold text-[#320000]">No Appointments</p>
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
              positiveClick={handleFinishAppointment}
              negativeClick={handleCancelAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAppointmentListPage;
