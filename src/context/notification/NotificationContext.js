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
import { api } from "../../lib/api";

const MessagingContext = createContext();

export function useMessage() {
  return useContext(MessagingContext);
}


export const MessagingProvider = ({ children }) => {
  const auth = useAuth();
  const notificationRef = collection(firestore, "Notifications");
  const toastMessage = (message) => toast(message);
  
  // const handleSendEmail = async () => {
  //   try {
  //     const res = await api.post('/api/sendmail', {
  //       sendTo: 'nathaniellucero20@gmail.com',
  //       subject: "Test Icles",
  //       message: "Sending my merry chirstmas to you"
  //     });
  //     console.log(res.data); // Log the success message
  //   } catch (error) {
  //     console.error(error.response?.data || error.message); // Log the error message
  //   }
  // };

  const sendEmail = async (recipient_email, content, subject) => {
    try {
      const res = await api.post('/api/sendemail', {
        sendTo: recipient_email,
        subject,
        message: content
      });
      if(res){
        return res
      }
    } catch (error) {
      toastMessage(error.message);
    }
  };

  const sendEmailRegistrationRequest = async (recipient_email, senderName) => {
    try {
      const res = await api.post('/api/sendemail', {
        sendTo: recipient_email,
        subject: `STGONC Registration Request`,
        message: `A new registration request has been posted by ${senderName}`
      });
      if(res){
        return res
      }
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
