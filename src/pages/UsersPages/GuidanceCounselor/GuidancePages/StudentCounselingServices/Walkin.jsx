import React, { useEffect, useState } from "react";
import WalkinForm from "../../GuidanceComponents/WalkinForm";
import Add from "../../../../../static/images/add.png";
import { useDB } from "../../../../../context/db/DBContext";
import SCSApptCards from "../../GuidanceComponents/SCSApptCards";
import SCSApptInfo from "../../GuidanceComponents/SCSApptInfo";

const Walkin = () => {
  const [isWalkingFormOpen, setisWalkingFormOpen] = useState(false);
  const db = useDB();
  const [appts, setAppts] = useState([]);
  const [currentSCSAppt, setCurrentSCSAppt] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToSCSChanges("Walkin", (callback) => {
        setAppts(callback);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  const handleOpenWalkinForm = () => {
    setisWalkingFormOpen(!isWalkingFormOpen);
    setCurrentSCSAppt(null)
  };

  useEffect(() => {
    if(currentSCSAppt){
      setisWalkingFormOpen(false)
    }
  },[currentSCSAppt])

  return (
    <div className="flex flex-col gap-5 h-[100%] w-full">
      <header className="flex flex-row items-center gap-10 h-[5%]">
        <h3>
          Walk-in <span className="font-light">Page</span>
        </h3>
        <button className="bg-transparent p-0" onClick={handleOpenWalkinForm}>
          <img src={Add} alt="add" height={35} width={35} />
        </button>
      </header>
      <main className="h-[95%] flex flex-row">
        <div
          className={`form-container transition-all duration-500 ease-out h-[100%] overflow-auto ${
            isWalkingFormOpen ? "w-1/2" : "w-0"
          }`}
        >
          {isWalkingFormOpen && !currentSCSAppt &&(
            <WalkinForm handleOpenWalkinForm={handleOpenWalkinForm} />
          )}
        </div>
        <div
          className={`data-container transition-all duration-500 ease-out max-h-[100%] pb-10 flex flex-col overflow-auto w-1/2
            `}
        >
          {appts.length !== 0
            ? appts.map((appt) => (
                <SCSApptCards
                  appt={appt}
                  setCurrentSCSAppt={setCurrentSCSAppt}
                  currentSCSAppt={currentSCSAppt}
                />
              ))
            : "No Walkin Data yet"}
        </div>

        {currentSCSAppt && !isWalkingFormOpen && (
          <div className="flex w-1/2 px-5">
            <SCSApptInfo
              currentSCSAppt={currentSCSAppt}
              setCurrentSCSAppt={setCurrentSCSAppt}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Walkin;
