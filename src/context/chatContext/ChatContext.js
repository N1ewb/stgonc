import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function useChat() {
  return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
  const [currentChatReceiver, setCurrentChatReceiver] = useState(null);
  const value = {
    currentChatReceiver,
    setCurrentChatReceiver,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
