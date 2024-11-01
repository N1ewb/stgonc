import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../../context/db/DBContext";
import PendingWalkincard from "../../../admin-components/walkins/PendingWalkincard";
import WalkinInfo from "./WalkinInfo";

const WalkinPendingAppointment = () => {
  const db = useDB();
  const [pendingList, setPendingList] = useState([]);
  const [currentWalkin, setCurrentWalkin] = useState(null);

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
    <div className="flex justify-start items-start w-full h-full">
      <div className="flex flex-wrap w-1/2 gap-3 max-h-[90%] overflow-auto py-3 ">
        {pendingList.length !== 0 &&
          pendingList.map((walkin) => (
            <div className="w-[48%]" key={walkin.id}>
              {" "}
              <PendingWalkincard walkin={walkin} currentWalkin={currentWalkin} setCurrentWalkin={setCurrentWalkin} />
            </div>
          ))}
      </div>
      <div
          className={`transition-transform duration-500 ease-in-out pb-5 px-2 ${
            currentWalkin ? "w-1/2 mx-3 translate-x-0"  : "w-0 translate-x-[100%]"
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

export default WalkinPendingAppointment;
