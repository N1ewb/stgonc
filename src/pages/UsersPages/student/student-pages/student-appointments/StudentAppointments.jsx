import React, { useEffect, useState } from "react";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import StudentAppointmentCard from "../../student-components/Appointments/StudentAppointmentCard";
import AppointmentInfo from "../../student-components/Appointments/AppointmentInfo";
import { api } from "../../../../../lib/api";

const StudentAppointments = () => {
  const chat = useChat();
  const db = useDB();
  const auth = useAuth();
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToRequestedAppointmentChanges(
            "Accepted",
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
  }, [db]);

  const handleSendEmail = async () => {
    try {
      const res = await api.post('/api/sendEmail', {
        sendTo: 'nathaniellucero20@gmail.com',
        subject: "Test Icles",
        message: "Sending my merry chirstmas to you"
      });
      console.log(res.data); // Log the success message
    } catch (error) {
      console.error(error.response?.data || error.message); // Log the error message
    }
  };
  

  return (
    <div className="flex flex-col gap-10 h-full">
      <div className="div-header">
        <h1 className="font-light text-[#720000]">
          Your <span className="font-bold">Appointments</span>
        </h1>
      </div>
      <button onClick={handleSendEmail}>SEND SAMPLE EMAIL</button>
      <div className="flex flex-row justify-between items-start h-full">
        <div className="div w-[50%] lg:w-full flex gap-2 flex-wrap max-h-[80%] overflow-x-hidden overflow-y-auto">
          {appointments && appointments.length !== 0
            ? appointments.map((appointment) => (
                <StudentAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  setCurrentAppointment={setCurrentAppointment}
                  currentAppointment={currentAppointment}
                />
              ))
            : ""}
        </div>
        <div className="w-[48%] lg:w-full lg:absolute transition-all ease-in-out duration-300">
          {currentAppointment && (
            <AppointmentInfo
              appointment={currentAppointment}
              setCurrentAppointmentInfo={setCurrentAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAppointments;
