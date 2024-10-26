import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useAppointment } from "../../../../../context/appointmentContext/AppointmentContext";
import AppointmentReqList from "../../../../../components/appointments/AppointmentReqList";
import AppointmentInfo from "../../../../../components/appointments/AppointmentInfo";

const GuidanceAppointmentReq = () => {
  const db = useDB();
  const auth = useAuth();
  const [appointments, setAppointments] = useState([]);
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [temp, setTemp] = useState([]);

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
  return (
    <div>
      <header className="pb-10">
        <h4 className="font-bold"> Requests</h4>
      </header>
      <main className="w-full flex flex-row justify-between items-start h-[100%]">
        <div className="w-1/2 max-h-full overflow-auto pb-3 flex flex-row flex-wrap">
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
      </main>
    </div>
  );
};

export default GuidanceAppointmentReq;
