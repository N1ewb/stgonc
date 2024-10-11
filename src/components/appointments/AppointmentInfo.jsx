import React, { useEffect, useState } from "react";
import Close from "../../static/images/close-dark.png";
import { useAppointment } from "../../context/appointmentContext/AppointmentContext";
import { useDB } from "../../context/db/DBContext";

const AppointmentInfo = ({
  handleAcceptAppointment,
  handleDenyAppointment,
}) => {
  const db = useDB()
  const { currentAppointment, setCurrentAppointment } = useAppointment();
  const [appointee, setAppointee] = useState(null);

  
  const handleGetUser = async (uid) => {
    try {
      const user = await db.getUser(uid);
      setAppointee(user);
    } catch (error) {
      console.log(`Error in retrieving user data: ${error.message}`);
    }
  };

  
  useEffect(() => {
    if (currentAppointment.appointee) {
      handleGetUser(currentAppointment.appointee);
    }
  }, [currentAppointment.appointee]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="appointment-info w-full flex flex-col">
      <div className="appointment-info-header text-[#320000] w-full flex flex-row justify-between items-center p-2 rounded-md border-b-[1px] border-solid border-[#d1d1d1d1] mb-5">
        <h3 className="capitalize m-0">
          <span className="font-semibold">
            {currentAppointment.appointmentStatus === "Accepted"
              ? "Appointment"
              : currentAppointment.appointmentStatus === "Pending"
              ? "Request"
              : "No"}
          </span>{" "}
          <span className="font-light">Information</span>
        </h3>
        <button
          className="bg-transparent font-bold text-[#320000]"
          onClick={() => setCurrentAppointment(null)}
        >
          <img src={Close} alt="close" height={20} width={20} />
        </button>
      </div>
      <div className="appointment-info-body [&_span]:text-[13px] capitalize">
        <p>
          <span className="text-[#7a7a7ad1] ">Student Name:</span>{" "}
          {`${appointee?.firstName} ${appointee?.lastName} `}
        </p>
        <p>
          <span className="text-[#7a7a7ad1]">Student Concern:</span>
          <br></br>
          {currentAppointment.appointmentConcern}
        </p>
        <div className="flex flex-row gap-3">
          {" "}
          <p className="capitalize">
            <span className="text-[#7a7a7ad1]">Type:</span>{" "}
            {currentAppointment.appointmentType}
          </p>
          <p>
            <span className="text-[#7a7a7ad1]">Date:</span>{" "}
            {formatDate(currentAppointment.appointmentDate)}
          </p>
          <p>
            <span className="text-[#7a7a7ad1]">Time:</span>{" "}
            {`${currentAppointment.appointmentsTime.appointmentStartTime}:00 - ${currentAppointment.appointmentsTime.appointmentEndTime}:00`}
          </p>
        </div>
      </div>
      {currentAppointment.appointmentStatus === "pending" ? (
        <div className="appointment-info-footer w-full flex flex-row items-end justify-end gap-3 ">
          <button
            className="m-0 py-2 px-5 bg-[#57a627] rounded-md"
            onClick={() => handleAcceptAppointment(currentAppointment.id)}
          >
            Accept
          </button>
          <button
            className="m-0 py-2 px-5 bg-[#720000] rounded-md"
            onClick={() => handleDenyAppointment(currentAppointment.id)}
          >
            Deny
          </button>
        </div>
      ) : currentAppointment.appointmentStatus === "Accepted" ? (
        <div className="appointment-info-footer w-full flex flex-row items-end justify-end gap-3 ">
          <button className="m-0 py-2 px-5 bg-[#57a627] rounded-md">
            Finish
          </button>
          <button className="m-0 py-2 px-5 bg-[#720000] rounded-md">
            Cancel
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AppointmentInfo;
