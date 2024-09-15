import React, { createContext, useContext, useState } from "react";

const AppointmentContext = createContext();

export function useAppointment() {
  return useContext(AppointmentContext);
}

export const Appointmentprovider = ({ children }) => {
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const value = {
    currentAppointment,
    setCurrentAppointment,
  };
  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
