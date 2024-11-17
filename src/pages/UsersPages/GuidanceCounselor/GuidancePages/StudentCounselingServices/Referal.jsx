import React, { useEffect, useState } from "react";
import Add from "../../../../../static/images/add.png";
import ReferalForm from "../../GuidanceComponents/ReferalForm";
import { useDB } from "../../../../../context/db/DBContext";
import SCSApptCards from "../../GuidanceComponents/SCSApptCards";
import SCSApptInfo from "../../GuidanceComponents/SCSApptInfo";

const Referal = () => {
  const [isFormOpen, setisFormOpen] = useState(false);
  const db = useDB();
  const [appts, setAppts] = useState([]);
  const [currentSCSAppt, setCurrentSCSAppt] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToSCSChanges("Referral", (callback) => {
        setAppts(callback);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  const handleOpenForm = () => {
    setisFormOpen(!isFormOpen);
    setCurrentSCSAppt(null)
  };
  useEffect(() => {
    if(currentSCSAppt){
      setisFormOpen(false)
    }
  },[currentSCSAppt])

  return (
    <div className="flex flex-col gap-2 h-full w-full">
      <header className="flex flex-row items-center gap-4 h-[3%]">
        <h3>
          Referral <span className="font-light">Page</span>
        </h3>
        <button className="bg-transparent p-0" onClick={handleOpenForm}>
          <img src={Add} alt="add" height={35} width={35} />
        </button>
      </header>
      <main className="h-full w-full flex items-start pb-5">
        <div
          className={`form-container transition-all duration-500 ease-out h-[100%] overflow-auto ${
            isFormOpen ? "w-1/2" : "w-0"
          }`}
        >
          {isFormOpen && !currentSCSAppt && <ReferalForm handleOpenForm={handleOpenForm} />}
        </div>
        <div
          className={`data-container pb-4 flex flex-row flex-wrap transition-all duration-500 ease-out max-h-full items-start justify-start overflow-auto w-1/2
          }`}
        >
          {appts.length !== 0
            ? appts.map((appt) => (
                <SCSApptCards
                  key={appt.id}
                  appt={appt}
                  setCurrentSCSAppt={setCurrentSCSAppt}
                  currentSCSAppt={currentSCSAppt}
                />
              ))
            : "No referal data yet"}
        </div>
        {currentSCSAppt && !isFormOpen &&(
          <div className="flex w-1/2 px-5">
            {" "}
            <SCSApptInfo
              currentSCSAppt={currentSCSAppt}
              setCurrentSCSAppt={setCurrentSCSAppt}
            />{" "}
          </div>
        )}
      </main>
    </div>
  );
};

export default Referal;
