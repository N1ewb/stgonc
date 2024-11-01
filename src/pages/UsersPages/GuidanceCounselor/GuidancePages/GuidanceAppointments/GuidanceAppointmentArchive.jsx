import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";
import AppointmentList from "../../../../../components/appointments/AppointmentsList";
import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";

const GuidanceAppointmentArchive = () => {
  const db = useDB();
  const auth = useAuth();
  const chat = useChat();
  const navigate = useNavigate();
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    setCurrentAppointment(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges(
            ["Accepted", "Followup", "Finished", "Cancelled", "Denied"],
            (callback) => {
              setAppointments(callback);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [db, auth.currentUser]);

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
    <div className="h-full">
      <header className="pb-10">
        <h4 className="font-bold">Archive</h4>
      </header>
      <main>
        <div className="appoinments-container w-full flex flex-row justify-between items-start h-[100%]">
          <div className="all-appointments-container w-1/2 max-h-full flex flex-row flex-wrap overflow-auto pb-3">
            {appointments && appointments.length ? (
              appointments.map((appointment, index) => (
                <AppointmentList
                  key={index}
                  appointment={appointment}
                  setCurrentChatReceiver={chat.setCurrentChatReceiver}
                />
              ))
            ) : (
              <p>No past appointments</p>
            )}
          </div>

          <div
            className={`w-[45%] bg-white shadow-md rounded-[30px] p-10 transition-all ease-in-out duration-300 ${
              currentAppointment
                ? "opacity-100 h-auto translate-x-0"
                : "opacity-0 h-0 -translate-x-10"
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
      </main>
    </div>
  );
};

export default GuidanceAppointmentArchive;