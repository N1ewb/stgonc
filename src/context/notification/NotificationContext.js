import React, { createContext, useContext } from "react";
import { useAuth } from "../auth/AuthContext";
import emailjs from "@emailjs/browser";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../server/firebase";

import toast, { Toaster } from "react-hot-toast";

const MessagingContext = createContext();

export function useMessage() {
  return useContext(MessagingContext);
}


export const MessagingProvider = ({ children }) => {
  const auth = useAuth();
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
        .sendForm("service_vfk9424", "template_z5a9rqm", form, {
          publicKey: "8BBDOBwWlicJlebvq",
          privateKey: "m5ISSvW-0RaQIXjqUBH4Q",
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
          publicKey: "8BBDOBwWlicJlebvq",
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

  const storeUserNotifToDB = async (sender, receiver, subject, content) => {
    try {
      const newNotification = {
        subject: subject,
        content: content,
        createdAt: serverTimestamp(),
        read: false,
        sentBy: sender,
        sentTo: receiver,
        participants: [sender, receiver],
      };

      await addDoc(notificationRef, newNotification);

      // EMAIL NOTIFICATION
      await sendEmailRegistrationRequest(receiver, sender);

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
          createdAt: serverTimestamp(),
          read: false,
          sentBy: auth.currentUser.email,
          sentTo: receiver,
          participants: [auth.currentUser.email, receiver],
        };

        await addDoc(notificationRef, newNotification);

        // EMAIL NOTIFICATION
        await sendEmail(receiver, content, subject);

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

  async function MarkNotifRead(id) {
    try {
      const notificationDocsRef = doc(firestore, "Notifications", id);
      await updateDoc(notificationDocsRef, { read: true });
    } catch (error) {
      toastMessage(`Error in marking notification,: ${error.message}`);
    }
  }

  async function DeleteNotif(id) {
    try {
      const notificationDocsRef = doc(firestore, "Notifications", id);
      await deleteDoc(notificationDocsRef);
    } catch (error) {
      toastMessage(`Error in deleteing notification: ${error.message}`);
    }
  }

  const value = {
    storeNotifToDB,
    storeUserNotifToDB,
    getUserNotifications,
    subscribeToUserNotifications,
    MarkNotifRead,
    DeleteNotif,
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
