import React, { useEffect, useState } from "react";
import PeopleIcon from "../../../../../static/images/people.png";
import { useAuth } from "../../../../../context/auth/AuthContext";

const TodayInfo = ({ apptList }) => {
  const auth = useAuth()
  const [walkins, setWalkins] = useState([]);
  const [referals, setReferals] = useState([])
  const [apptToday, setApptToday] = useState([]);
  const [ongoingAppt, setOngoingAppt] = useState([])

  const handleGetOngoingAppt = async (apptList) => {
    if(apptList){
      const filteredApptList = apptList.filter((appt) => 
        appt.appointmentStatus === "Accepted"
      )
      setOngoingAppt(filteredApptList) 
    }
  }

  const handlefindApptsToday = () => {
    const today = new Date().toISOString().split("T")[0];
    const filterApptList = apptList.filter(
      (appt) => appt.appointmentDate === today
    );
    setApptToday(filterApptList);
    
  };

  useEffect(() => {
    handlefindApptsToday();
  }, [apptList]);

  useEffect(() => {
    handleGetOngoingAppt(apptToday)
  },[apptToday])

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
  useEffect(() => {
    const fetchData = async () => {
      if (apptToday) {
        const filterdAppt = apptList.filter(
          (appt) => appt.appointmentFormat === "Referal"
        );
        setReferals(filterdAppt);
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
        <div className="total-ongoing flex flex-row items-center justify-between p-2">
          <div className="flex flex-row items-center gap-3">
            <div className="img-wrapper flex items-center justify-center rounded-full p-1 bg-[#FFC107] h-[50px] w-[50px]">
              <img src={PeopleIcon} alt="people" />
            </div>
            {auth.currentUser.role === "Guidance" ?   <p>Total Referals</p> :  <p>Total Ongoing Appointments</p>}
          
          </div>
          {auth.currentUser.role === "Guidance" ? <span>{referals && referals.length}</span> : <span>{ongoingAppt && ongoingAppt.length}</span>}
        </div>
        
      </div>
    </div>
  );
};

export default TodayInfo;
