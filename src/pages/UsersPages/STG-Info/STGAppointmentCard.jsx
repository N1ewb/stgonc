import React, { useEffect, useState } from "react";
import { useDB } from "../../../context/db/DBContext";
import STGAllFollowUpCards from "./STGFollowUpCards";
import STGAdditionalInfo from "./STGAdditionalInfo";

const STGAppointmentCard = ({ appt }) => {
  const db = useDB();
  const [followups, setFollowups] = useState([]);
  const [isExteded, setIsExtended] = useState(false);

  const handleExtend = () => {
    setIsExtended(!isExteded);
  };

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
    <div className="h-auto w-full flex flex-col px-10 pt-10 pb-5 gap-3">
      <div className="w-full rounded-md shadow-md bg-white px-5 pt-5 pb-2">
        <header className="flex justify-between w-full">
          <h2 className="text-[20px]">{appt.appointmentDate}</h2>
          <button>Download Report PDF</button>
        </header>
        <main>{isExteded && <STGAdditionalInfo appt={appt} />}</main>
        <footer className="w-full flex justify-center">
          <button onClick={handleExtend}>
            {isExteded ? <span>Retract</span> : <span>Extend</span>}
          </button>
        </footer>
      </div>
      <h3 className="text-[16px]">Follow up Appointments</h3>
      <div className="w-full flex gap-5">
       
        {followups.length !== 0
          ? followups.map((followup) => (
              <STGAllFollowUpCards key={followup.id} followup={followup} />
            ))
          : "This appointment had no followups"}
      </div>
    </div>
  );
};

export default STGAppointmentCard;
