import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../../context/db/DBContext";
import PendingWalkincard from "../../../admin-components/walkins/PendingWalkincard";

const WalkinPendingAppointment = () => {
  const db = useDB();
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToWalkinAppointmentChanges(
        "Pending",
        (callback) => {
          setPendingList(callback);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-wrap w-1/2 gap-3 max-h-[90%] overflow-auto py-3 ">
        {pendingList.length !== 0 &&
          pendingList.map((walkin) => (
            <div className="w-[48%]" key={walkin.id}>
              {" "}
              <PendingWalkincard walkin={walkin} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default WalkinPendingAppointment;
