import { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import SCSApptCards from "../../GuidanceComponents/SCSApptCards";
import SCSApptInfo from "../../GuidanceComponents/SCSApptInfo";

const SCSDashboard = () => {
  const db = useDB();
  const [appts, setAppts] = useState([]);
  const [currentSCSAppt, setCurrentSCSAppt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToSCSChanges(
        ["Referal", "Walkin"],
        (callback) => {
          setAppts(callback);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  
  return (
    <div className="w-full h-full">
      <header>
        <h3 className="font-bold"> Dashboard</h3>
      </header>
      <main className="h-full flex flex-row w-full  pb-10">
        <div className="cards-container w-1/2 flex flex-row flex-wrap items-start justify-start max-h-full !overflow-auto">
          {appts.length !== 0
            ? appts.map((appt) => (
                <SCSApptCards
                  appt={appt}
                  key={appt.id}
                  currentSCSAppt={currentSCSAppt}
                  setCurrentSCSAppt={setCurrentSCSAppt}
                />
              ))
            : "No appts"}
        </div>
        <div className="flex w-[48%] px-5">
          {currentSCSAppt && <SCSApptInfo currentSCSAppt={currentSCSAppt} setCurrentSCSAppt={setCurrentSCSAppt} />}
        </div>
      </main>
    </div>
  );
};

export default SCSDashboard;
