import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../../context/db/DBContext";
import WalkinInfo from "./WalkinInfo";
import ApptListCard from "../../../admin-components/walkins/ApptListCard";

const WalkinApptList = () => {
  const [currentWalkin, setCurrentWalkin] = useState();
  const db = useDB();
  const [walkinAppointmentList, setWalkinAppointmentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = db.subscribeToWalkinAppointmentChanges(
          ["Recorded", "Pending"],
          (appointments) => {
            setWalkinAppointmentList(appointments);
          }
        );
        return () => unsubscribe && unsubscribe();
      } catch (error) {
        console.error("Error fetching walk-in appointments:", error);
      }
    };
    fetchData();
  }, [db]);

  return (
    <div className="walkin-appointment-list-container h-full w-full flex justify-between ">
      <div className={`w-1/2 grid grid-cols-2 items-start max-h-[90%] gap-3 overflow-auto p-3`}>
        {walkinAppointmentList.length > 0 ? (
          walkinAppointmentList.map((appointment) => (
            <div key={appointment.id} className="w-full h-fit">
              <ApptListCard
                appointment={appointment}
                setCurrentWalkin={setCurrentWalkin}
                currentWalkin={currentWalkin}
              />
            </div>
          ))
        ) : (
          <p>No walk-in appointment records</p>
        )}
      </div>
      <div
        className={`transition-transform duration-500 ease-in-out pb-5 px-2 ${
          currentWalkin ? "w-[48%] mx-3 translate-x-0" : "w-0 translate-x-[100%]"
        } overflow-hidden`}
      >
        {currentWalkin && (
          <WalkinInfo
            currentWalkin={currentWalkin}
            setCurrentWalkin={setCurrentWalkin}
          />
        )}
      </div>
    </div>
  );
};

export default WalkinApptList;
