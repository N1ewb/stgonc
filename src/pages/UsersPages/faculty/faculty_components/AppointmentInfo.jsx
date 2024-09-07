import React from "react";
import Close from "../../../../static/images/close-dark.png";
const AppointmentInfo = ({
  currentAppointment,
  handleSetCurrentAppointment,
}) => {
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
          <span className="font-semibold">Request</span>{" "}
          <span className="font-light">Information</span>
        </h3>
        <button
          className="bg-transparent font-bold text-[#320000]"
          onClick={() => handleSetCurrentAppointment(null)}
        >
          <img src={Close} alt="close" height={20} width={20} />
        </button>
      </div>
      <div className="appointment-info-body [&_span]:text-[13px]">
        <p>
          <span className="text-[#7a7a7ad1]">Student Name:</span>{" "}
          {currentAppointment.appointee.name}
        </p>
        <p>
          <span className="text-[#7a7a7ad1]">Student Concern:</span>
          <br></br>
          {currentAppointment.appointmentConcern}
        </p>
      </div>
      <div className="appointment-info-footer w-full flex flex-row gap-3 [&_span]:text-[13px]">
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
  );
};

export default AppointmentInfo;
