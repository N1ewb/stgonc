import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  Children,
} from "react";
import { messaging, firestore } from "../../server/firebase";
import { getToken, onMessage } from "firebase/messaging";

const MessagingContext = createContext();

export function useMessage() {
  return useContext(MessagingContext);
}

export const MessagingProvider = ({ children }) => {
  const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log(permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BHQX6XyX9KEnCcLlokftq_ILPPcxK7ObPq3YaMURvhjCUQ-n6cssh8uC9AR5VtyOc0O_9uOf2gTNv97gzNYEIJc",
      });

      console.log(token);
    }
  };

  const OnMessage = onMessage(messaging, (payload) => {
    console.log(payload);
  });

  const value = {
    generateToken,
    OnMessage,
  };

  return (
    <>
      <MessagingContext.Provider value={value}>
        {children}
      </MessagingContext.Provider>
    </>
  );
};
