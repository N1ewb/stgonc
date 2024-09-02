import React, { createContext, useContext } from "react";
import { useAuth } from "../auth/AuthContext";
import { useDB } from "../db/DBContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../server/firebase";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { Toast } from "react-bootstrap";

const MessagingContext = createContext();

export function useMessage() {
  return useContext(MessagingContext);
}

export const MessagingProvider = ({ children }) => {
  const auth = useAuth();
  const db = useDB();
  const notificationRef = collection(firestore, "Notification");
  const toastMessage = (message) => toast(message);

  const sendEmail = async (
    from_name,
    sender_email,
    recipient_email,
    content,
    subject
  ) => {
    const form = document.createElement("form");

    const dummyData = {
      from_name,
      to_email: recipient_email,
      from_email: sender_email,
      message: content,
      subject: subject,
    };
    Object.keys(dummyData).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = dummyData[key];
      form.appendChild(input);
    });
    try {
      emailjs
        .sendForm("service_6ohiq8x", "template_t4nesyk", form, {
          publicKey: "4rNJQUW9Fyeif9_7A",
        })
        .then(
          () => {
            toastMessage("SUCCESS!");
          },
          (error) => {
            console.log("FAILED...", error);
          }
        );
    } catch (error) {
      toastMessage(error.message);
    }
  };

  const storeNotifToDB = async (subject, content, receiver) => {
    try {
      if (auth.currentUser) {
        const newNotification = {
          subject,
          content,
          createAt: serverTimestamp(),
          read: false,
          sentBy: auth.currentUser.email,
          sentTo: receiver,
          participants: [auth.currentUser.email, receiver],
        };
        await addDoc(notificationRef, newNotification);
        sendEmail(
          auth.currentUser.displaName,
          auth.currentUser.email,
          receiver.email,
          content,
          subject
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    storeNotifToDB,
  };

  return (
    <>
      <MessagingContext.Provider value={value}>
        {children}
        <Toast />
      </MessagingContext.Provider>
    </>
  );
};
