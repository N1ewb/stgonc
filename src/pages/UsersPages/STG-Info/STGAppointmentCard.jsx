import React, { useEffect, useState } from "react";
import { useDB } from "../../../context/db/DBContext";
import STGAllFollowUpCards from "./STGFollowUpCards";

const STGAppointmentCard = ({ appt, setCurrentAppt, currentAppt, handleDownloadRecord }) => {
  const db = useDB();
  const [followups, setFollowups] = useState([]);
  const [appointee, setAppointee] = useState(null);

  useEffect(() => {
    if (appt) {
      async function handleGetUser() {
        const user = await db.getUser(appt.appointee);
        setAppointee(user);
      }
      handleGetUser();
    }
  }, [appt.appointee]);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToApptFollowupChanges(
        appt.id,
        (callback) => {
          setFollowups(callback);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  

  return (
    <div className="h-auto w-full flex flex-col px-10 py-5 gap-3">
      <h1 className="text-[16px]">Main Appointment</h1>
      <div
        onClick={() =>
          setCurrentAppt(currentAppt && currentAppt === appt ? null : appt)
        }
        className="cursor-pointer flex flex-col p-3 text-[#320000] rounded-3xl w-[60%] h-fit
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 bg-white"
      >
        <header className="flex justify-between border-b-[1px] border-[#7b7b7b] border-solid">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold">{appt.appointmentType}</h2>
            <p>{`${appointee?.firstName} ${appointee?.lastName}`}</p>
          </div>
        </header>

        <footer className="w-full flex justify-between items-center p-1">
          <p>{appt.appointmentDate}</p>
          <button onClick={(e) => handleDownloadRecord(appt, e)} className="bg-[#72B9FF] rounded-3xl py-2 px-3">
            Download
          </button>
        </footer>
      </div>
      <h3 className="text-[16px]">Follow up Appointments</h3>
      <div className="max-w-full flex gap-3 overflow-auto pb-4">
        {followups.length !== 0
          ? followups.map((followup) => (
              <STGAllFollowUpCards
                key={followup.id}
                followup={followup}
                appointee={appointee}
                setCurrentAppt={setCurrentAppt}
                currentAppt={currentAppt}
                handleDownloadRecord={handleDownloadRecord}
              />
            ))
          : "This appointment had no finished followups"}
      </div>
    </div>
  );
};

export default STGAppointmentCard;
