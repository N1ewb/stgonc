import React, { createContext, useContext, useEffect, useState } from "react";

const ExportContext = createContext();

export function useExport() {
  return useContext(ExportContext);
}

export const ExportProvider = ({ children }) => {
  const [currentAppointmentData, setCurrentAppointmentData] = useState(null);
  // useEffect(() => {
  //   if(currentAppointmentData){
  //     console.log(currentAppointmentData)
  //   }
  // },[currentAppointmentData])
  const value = {
    currentAppointmentData,
    setCurrentAppointmentData,
  };
  return (
    <ExportContext.Provider value={value}>
      {children}
    </ExportContext.Provider>
  );
};
