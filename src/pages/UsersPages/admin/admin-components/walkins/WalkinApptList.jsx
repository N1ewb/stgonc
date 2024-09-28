import React, { useEffect, useState } from 'react';
import { useDB } from '../../../../../context/db/DBContext';
import More from '../../../../../static/images/more-light.png'

const WalkinApptList = ({setCurrentWalkin, currentWalkin}) => {
  const db = useDB();
  const [walkinAppointmentList, setWalkinAppointmentList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = db.subscribeToWalkinAppointmentChanges((appointments) => {
          setWalkinAppointmentList(appointments);
        });
        return () => unsubscribe && unsubscribe()
      } catch (error) {
        console.error('Error fetching walk-in appointments:', error);
      }
    };
    fetchData();
  }, [db]);

  return (
    <div className="w-full h-[100%]">
      <div className="walkin-appointment-list-header w-full">
        <h3 className="text-[#720000] w-full">Walk-in Appointments List</h3>
      </div>
      <div className="walkin-appointment-list-content h-[100%] text-black">
        {walkinAppointmentList.length > 0 ? (
          walkinAppointmentList.map((appointment) => (
            <div key={appointment.id} className='flex flex-row shadow-md items-center rounded-3xl p-5 justify-between'>
              <p className='capitalize'>Name: {appointment.appointee.firstName} {appointment.appointee.lastName}</p>
              
              <p>Date: {appointment.appointmentDate}</p>
              <button className='bg-transparent hover:bg-transparent p-0 m-0' onClick={() => setCurrentWalkin(currentWalkin && currentWalkin == appointment ? null  : appointment)}><img src={More} alt='info' height={25} width={25} /></button>
            </div>
          ))
        ) : (
          <p>No walk-in appointment records</p>
        )}
      </div>
    </div>
  );
};

export default WalkinApptList;
