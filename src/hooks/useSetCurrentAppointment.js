import { useState } from "react";

export const useSetCurrentAppointment = () => {
  const [currentAppointment, setCurrentAppointment] = useState(null);
  console.log("current appointment", currentAppointment);
  const values = {
    currentAppointment,
    setCurrentAppointment,
  };
  return values;
};
