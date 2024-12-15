import React from "react";
import { useAuth } from "../../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const SCSApptInfo = ({ currentSCSAppt, setCurrentSCSAppt }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate()


  const yearLevel = (yrlvl) => {
    switch (yrlvl) {
      case "1":
        return "1st";

      case "2":
        return "2nd";
      case "3":
        return "3rd";
      case "4":
        return "4th";
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-10 shadow-md rounded-3xl w-full max-h-[600px] ">
      <header className="flex flex-row w-full items-center justify-between border-b-[1px] border-solid border-[#c2c2c2] pb-3">
        <h1 className="font-semibold text-2xl">
          {currentSCSAppt.appointmentFormat === "Walkin"
            ? "Walk-In"
            : currentSCSAppt.appointmentFormat === "Referral"
            ? "Referral"
            : "No"}

          <span className="font-light"> Info</span>
        </h1>
        <button
          className="bg-[#720000] hover:bg-[#320000]"
          onClick={() => setCurrentSCSAppt(null)}
        >
          X
        </button>
      </header>
      <main className="flex flex-col py-5 [&_span]:text-[#a5a5a5] [&_span]:normal-case [&_p]:text-[#320000] [&_p]:capitalize max-h-[90%] w-full overflow-auto">
        <div className="client-information">
          <div className="heading [&_h2]:text-sm">
            <h2>Client Information</h2>
          </div>
          <p>
            <span>Name:</span> {currentSCSAppt.appointee.firstName}{" "}
            {currentSCSAppt.appointee.lastName}
          </p>
          <p>
            <span>Year Level/ Age: </span> {yearLevel(currentSCSAppt.yearLevel)}{" "}
            / {currentSCSAppt.age}
          </p>
          <p>
            <span>Counselor Name: </span>
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p>
            <span>Session Number: </span> {currentSCSAppt.sessionNumber}
          </p>
          <p>
            <span>Location: </span>
            {currentSCSAppt.location}
          </p>
          {currentSCSAppt.appointmentFormat === "Referral" && (
            <p>
              <span>Refered By:</span> {currentSCSAppt?.referee}
            </p>
          )}
        </div>
        <div className="counselor-observations w-full">
          <div className="heading w-full flex justify-between items-center [&_h2]:text-sm">
            <h2>Counselor's Observation</h2>
          </div>
          <p>
            <span>Observation: </span>
            {currentSCSAppt.observation}
          </p>
          <p>
            <span>Non-verbal Cues: </span>
            {currentSCSAppt.nonVerbalCues}
          </p>
          <p>
            <span>Date of Session: </span>
            {currentSCSAppt.appointmentDate}
          </p>
          <p>
            <span>Techniques Approached Used: </span>
            {currentSCSAppt.techniques}
          </p>
          <p>
            <span>Action Plan/ Next Steps: </span>
            {currentSCSAppt.actionPlan}
          </p>
          <p>
            <span>Evaluation: </span>
            {currentSCSAppt.evaluation}
          </p>
        </div>
      </main>
      <footer className="flex py-3 w-full items-center justify-between ">
        <button className="bg-green-500 rounded-md px-4 py-2 text-[10px]" onClick={() => navigate(`/private/Guidance/student-counseling-services/add-followup-record?appointment=${currentSCSAppt.precedingApt || currentSCSAppt.id}`)}>
          Add Follow-up Record
        </button>
        <button className="bg-[#273240] rounded-md px-4 py-2 text-[10px]" onClick={() => navigate(`/private/Guidance/student-counseling-services/view-appointment-record?appointment=${currentSCSAppt.precedingApt || currentSCSAppt.id}`)}>View Full Appointment Records</button>
      </footer>
    </div>
  );
};

export default SCSApptInfo;
