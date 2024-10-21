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
    <div className="walkin-appointment-list-container h-[100%] w-full flex flex-row text-black">
      <div
        className={`transition-all duration-500 ease-out ${
          currentWalkin ? "w-1/2" : "w-full"
        }`}
      >
        {walkinAppointmentList.length > 0 ? (
          walkinAppointmentList.map((appointment) => (
            <ApptListCard key={appointment.id} appointment={appointment} setCurrentWalkin={setCurrentWalkin} currentWalkin={currentWalkin} />
          ))
        ) : (
          <p>No walk-in appointment records</p>
        )}
      </div>
      <div
        className={`transition-transform duration-500 ease-in-out pb-5 px-2 ${
          currentWalkin ? "w-1/2 mx-3 translate-x-0" : "w-0 translate-x-[100%]"
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
