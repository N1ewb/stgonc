import React from "react";

const SCSApptInfo = ({ currentSCSAppt, setCurrentSCSAppt }) => {
  return (
    <div className="flex flex-col p-10 shadow-md rounded-3xl w-full">
      <header className="flex flex-row w-full items-center justify-between border-b-[1px] border-solid border-[#c2c2c2] pb-3">
        <h3 className="font-semibold">
          {currentSCSAppt.appointmentFormat === "Walkin"
            ? "Walk-In"
            : currentSCSAppt.appointmentFormat === "Referal"
            ? "Referal"
            : "No"}

          <span className="font-light"> Info</span>
        </h3>
        <button onClick={() => setCurrentSCSAppt(null)}>X</button>
      </header>
      <main className="flex flex-col py-5 [&_span]:text-[#a5a5a5] [&_span]:normal-case [&_p]:text-[#320000] [&_p]:capitalize">
        <p>
          {" "}
          <span>Name:</span> {currentSCSAppt.appointee.firstName}{" "}
          {currentSCSAppt.appointee.lastName}
        </p>
        <p>
          <span>Department:</span> {currentSCSAppt.appointee.department}
        </p>
        <p>
          <span>Role: </span>
          {currentSCSAppt.appointee.role || "Student"}{" "}
        </p>
        <p>
          <span>Concern: </span>
          {currentSCSAppt.appointmentConcern}
        </p>
        <p>
          <span>Mode: </span>
          {currentSCSAppt.appointmentFormat}
        </p>
        {currentSCSAppt.appointmentFormat === "Referal" && (
          <p>
            <span>Refered By:</span> {currentSCSAppt?.referee}
          </p>
        )}
      </main>
    </div>
  );
};

export default SCSApptInfo;
