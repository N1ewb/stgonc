import React, { createContext, useContext, useState } from "react";

const ReschedContext = createContext();

export function useReschedDialog() {
  return useContext(ReschedContext);
}

export const ReschedProvider = ({ children }) => {
  const [openReschedDialog, setOpenReschedDialog] = useState(false);
  const [reschedappointment, setAppointment] = useState(null);
  const handleToggleReschedDialog = (appointment) => {
    setAppointment(appointment);
    setOpenReschedDialog(!openReschedDialog);
  };
  const value = {
    openReschedDialog,
    handleToggleReschedDialog,
    reschedappointment
  };
  return (
    <ReschedContext.Provider value={value}>{children}</ReschedContext.Provider>
  );
};
