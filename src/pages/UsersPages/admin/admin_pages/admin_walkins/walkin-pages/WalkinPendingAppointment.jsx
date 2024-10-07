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
    <div className="flex flex-col w-full h-[100%] p-10 gap-5">
      {pendingList.length !== 0 &&
        pendingList.map((walkin) => (
          <PendingWalkincard key={walkin.id} walkin={walkin} />
        ))}
    </div>
  );
};

export default WalkinPendingAppointment;
