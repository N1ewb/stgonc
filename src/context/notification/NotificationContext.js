import React, { createContext, useContext } from "react";
import { useAuth } from "../auth/AuthContext";
import { useDB } from "../db/DBContext";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore } from "../../server/firebase";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

const MessagingContext = createContext();

export function useMessage() {
  return useContext(MessagingContext);
}

export const MessagingProvider = ({ children }) => {
  const auth = useAuth();
  const db = useDB();
  const notificationRef = collection(firestore, "Notifications");
  const toastMessage = (message) => toast(message);

  const sendEmail = async (recipient_email, content, subject) => {
    const form = document.createElement("form");

    const dummyData = {
      from_name: "STGONC Team",
      from_email: "stgoncteam.spc@gmail.com",
      to_email: recipient_email,
      sender_name: auth.currentUser.displayName,
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
          publicKey: "3kBWbebX9h3kQSvMq",
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

  const sendEmailRegistrationRequest = async (recipient_email, senderName) => {
    const form = document.createElement("form");

    const dummyData = {
      from_name: "STGONC Team",
      from_email: "stgoncteam.spc@gmail.com",
      to_email: recipient_email,
      sender_name: senderName,
      message: "A new student has requested to register an account",
      subject: "Registration",
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
          publicKey: "3kBWbebX9h3kQSvMq",
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

  const storeRegistrationNotifToDB = async (sender, receiver) => {
    try {
      const newNotification = {
        subject: "Registration",
        content: "A new student has requested to register for an account",
        createAt: serverTimestamp(),
        read: false,
        sentBy: sender,
        sentTo: receiver,
        participants: [sender, receiver],
      };

      await addDoc(notificationRef, newNotification);

      // EMAIL NOTIFICATION
      // await sendEmailRegistrationRequest(receiver, senderName);

      return true;
    } catch (error) {
      console.error("Error storing notification or sending email:", error);
      toastMessage(error.message);
      return false;
    }
  };

  const storeNotifToDB = async (subject, content, receiver) => {
    try {
      if (auth.currentUser) {
        const newNotification = {
          subject: subject,
          content: content,
          createAt: serverTimestamp(),
          read: false,
          sentBy: auth.currentUser.email,
          sentTo: receiver,
          participants: [auth.currentUser.email, receiver],
        };

        await addDoc(notificationRef, newNotification);

        // EMAIL NOTIFICATION
        // await sendEmail(receiver, content, subject);

        return true;
      } else {
        throw new Error("User is not authenticated");
      }
    } catch (error) {
      console.error("Error storing notification or sending email:", error);
      toastMessage(error.message);
      return false;
    }
  };

  function subscribeToUserNotifications(email, callback) {
    if (!auth.currentUser) {
      throw new Error("User is not authenticated");
    }

    try {
      const q = query(
        notificationRef,
        where("sentTo", "==", email),
        where("read", "==", false)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        callback(notifications);
      });

      return unsubscribe;
    } catch (error) {
      console.error(`Error in subscribing to notifications: ${error.message}`);
      throw error;
    }
  }

  async function getUserNotifications(email) {
    try {
      if (auth.currentUser) {
        const q = query(
          notificationRef,
          where("sentTo", "==", email),
          where("read", "==", false)
        );

        const querySnapshot = await getDocs(q);
        const notifications = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return notifications;
      } else {
        throw new Error("User is not authenticated");
      }
    } catch (error) {
      throw new Error(`Error in retrieving notifications: ${error.message}`);
    }
  }

  const value = {
    storeNotifToDB,
    storeRegistrationNotifToDB,
    getUserNotifications,
    subscribeToUserNotifications,
  };

  return (
    <>
      <MessagingContext.Provider value={value}>
        {children}
        <Toaster />
      </MessagingContext.Provider>
    </>
  );
};
