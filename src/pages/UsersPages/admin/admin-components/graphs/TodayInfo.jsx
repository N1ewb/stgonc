import React, { useEffect, useState } from "react";
import PeopleIcon from "../../../../../static/images/people.png";

const TodayInfo = ({ apptList }) => {
  const [walkins, setWalkins] = useState([]);
  const [apptToday, setApptToday] = useState([]);
  useEffect(() => {
    const findApptsToday = () => {
      const today = new Date().toISOString().split("T")[0];
      const filterApptList = apptList.filter(
        (appt) => appt.appointmentDate === today
      );
      setApptToday(filterApptList);
    };

    findApptsToday();
  }, [apptList]);

  useEffect(() => {
    const fetchData = async () => {
      if (apptToday) {
        const filterdAppt = apptList.filter(
          (appt) => appt.appointmentFormat === "Walkin"
        );
        setWalkins(filterdAppt);
      }
    };
    fetchData();
  }, [apptToday]);

  return (
    <div className="today-info-container text-[#320000] flex flex-col gap-3">
      <div className="today-info-header">
        <h4 className="font-bold">Today</h4>
      </div>
      <div className="today-info-content [&_p]:m-0 flex flex-col ">
        <div className="total-appointments flex flex-row items-center justify-between p-2">
          <div className="flex flex-row items-center gap-3">
            <div className="img-wrapper flex items-center justify-center rounded-full p-1 bg-[#36D9D8] h-[50px] w-[50px]">
              <img src={PeopleIcon} alt="people" />
            </div>
            <p className="">Total Appointments</p>
          </div>
          <span>{apptToday && apptToday.length}</span>
        </div>
        <div className="total-walkins flex flex-row items-center justify-between p-2">
          <div className="flex flex-row items-center gap-3">
            <div className="img-wrapper flex items-center justify-center rounded-full p-1 bg-[#FF3D00] h-[50px] w-[50px]">
              <img src={PeopleIcon} alt="people" />
            </div>
            <p>Total Walk-ins</p>
          </div>
          <span>{walkins && walkins.length}</span>
        </div>
        
      </div>
    </div>
  );
};

export default TodayInfo;
