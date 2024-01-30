import React, { useContext, createContext } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  orderBy,
  limit,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../../server/firebase";
import { useAuth } from "../auth/AuthContext";

import toast, { Toaster } from "react-hot-toast";

const dbContext = createContext();

export function useDB() {
  return useContext(dbContext);
}

export const DBProvider = ({ children }) => {
  const usersCollectionRef = collection(firestore, "Users");
  const messagesRef = collection(firestore, "Messages");
  const appointmentsRef = collection(firestore, "Appointments");
  const auth = useAuth();

  const addSuccess = () => toast("Registered Successfuly");
  const notifyError = (error) => toast(error.message);

  const getUsers = async () => {
    try {
      if (auth.currentUser) {
        const usersSnapshot = await getDocs(usersCollectionRef);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return usersData;
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const getUser = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          usersCollectionRef,
          where("userID", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];

        if (userDoc) {
          return userDoc.data();
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getTeachers = async () => {
    try {
      if (auth.currentUser) {
        const q = query(usersCollectionRef, where("role", "==", "teacher"));

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return usersData;
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const sendAppointmentRequest = async (teacheremail, date, isOnline) => {
    try {
      if (auth.currentUser) {
        await addDoc(appointmentsRef, {
          appointedTeacherEmail: teacheremail,
          appointee: auth.currentUser.email,
          appointmentDate: date,
          appointmentStatus: "pending",
          appointmentType: "initial",
          appointmentDuration: "1 hour", // Adjusted
          isOnline: isOnline,
          createdAt: new Date(),
          teacherRemarks: null,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAppointmentRequests = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          appointmentsRef,
          where("appointedTeacherEmail", "==", auth.currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        const appointmentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (appointmentData) {
          return appointmentData;
        } else {
          return console.log("Nothing");
        }
      }
    } catch (error) {
      console.error();
    }
  };

  const approveAppointment = async (id) => {
    try {
      if (auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);

        const updatedAppointmentDocRef = { appointmentStatus: "Accepted" };

        return await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
      }
    } catch (error) {
      console.error();
    }
  };

  const denyAppointment = async (id) => {
    try {
      if (auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);

        const updatedAppointmentDocRef = { appointmentStatus: "Denied" };

        return await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
      }
    } catch (error) {
      console.error();
    }
  };

  const getMessages = async (receiver) => {
    try {
      if (auth.currentUser && receiver) {
        const querySnapshot = await getDocs(
          query(
            messagesRef,
            orderBy("createAt", "desc"),
            where(
              "participants",
              "array-contains",
              auth.currentUser.displayName
            ),
            limit(20)
          )
        );

        const messagesData = querySnapshot.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));

        return messagesData;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (formValue, uid, receiver) => {
    try {
      if (auth.currentUser) {
        await addDoc(messagesRef, {
          text: formValue,
          createAt: serverTimestamp(),
          uid,
          sentBy: auth.currentUser.displayName,
          sentTo: receiver,
          participants: [auth.currentUser.displayName, receiver],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToAppointmentChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedTeacherEmail", "==", auth.currentUser.email)
          ),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            callback(data);
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.error();
    }
  };

  const subscribeToMessageChanges = async (callback, receiver) => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          orderBy("createAt", "desc"),

          where("participants", "array-contains", auth.currentUser.displayName),
          limit(20)
        ),

        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(data);
        }
      );

      return unsubscribe;
    }
  };

  const value = {
    getUsers,
    getUser,
    getTeachers,
    sendAppointmentRequest,
    getAppointmentRequests,
    approveAppointment,
    denyAppointment,
    getMessages,
    sendMessage,
    subscribeToAppointmentChanges,
    subscribeToMessageChanges,
  };

  return (
    <dbContext.Provider value={value}>
      {children}
      <Toaster />
    </dbContext.Provider>
  );
};
