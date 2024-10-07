import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../../context/db/DBContext";
import More from "../../../../../../static/images/more-light.png";
import { useNavigate } from "react-router-dom";
import WalkinInfo from "./WalkinInfo";

const WalkinApptList = () => {
  const [currentWalkin, setCurrentWalkin] = useState();
  const db = useDB();
  const [walkinAppointmentList, setWalkinAppointmentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = db.subscribeToWalkinAppointmentChanges( ['Recorded', 'Pending'],
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
      <div className={`transition-all duration-500 ease-out ${currentWalkin ? "w-1/2" : "w-full"}`}>
        {walkinAppointmentList.length > 0 ? (
          walkinAppointmentList.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-row shadow-md items-center rounded-3xl p-5 justify-between"
            >
              <p className="capitalize">
                Name: {appointment.appointee.firstName}{" "}
                {appointment.appointee.lastName}
              </p>

              <p>Date: {appointment.appointmentDate}</p>
              <button
                className="bg-transparent hover:bg-transparent p-0 m-0"
                onClick={() =>
                  setCurrentWalkin(
                    currentWalkin && currentWalkin === appointment
                      ? null
                      : appointment
                  )
                }
              >
                <img src={More} alt="info" height={25} width={25} />
              </button>
            </div>
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
