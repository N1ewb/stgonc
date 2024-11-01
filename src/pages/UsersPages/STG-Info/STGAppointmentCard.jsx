import React, { useEffect, useState } from "react";
import { useDB } from "../../../context/db/DBContext";
import STGAllFollowUpCards from "./STGFollowUpCards";

const AppointmentCard = ({ appt }) => {
  const db = useDB();
  const [followups, setFollowups] = useState([]);

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
    <div className="h-full w-full flex flex-col p-10 gap-5">
      <header className="flex justify-between w-full rounded-md shadow-md bg-white p-5">
        <h1 className="text-[20px]">{appt.appointmentDate}</h1>
        <button>Download Report PDF</button>
      </header>
      <main className="w-full">
        {followups.length !== 0
          ? followups.map((followup) => (
              <STGAllFollowUpCards key={followup.id} followup={followup} />
            ))
          : "This appointment had no followups"}
      </main>
    </div>
  );
};

export default AppointmentCard;
