import React, { useContext, createContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { firestore, storage } from "../../server/firebase";
import { useAuth } from "../auth/AuthContext";

import toast, { Toaster } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useMessage } from "../notification/NotificationContext";

const dbContext = createContext();

export function useDB() {
  return useContext(dbContext);
}

export const DBProvider = ({ children }) => {
  const usersCollectionRef = collection(firestore, "Users");
  const messagesRef = collection(firestore, "Messages");
  const appointmentsRef = collection(firestore, "Appointments");
  const studentRegistrationRequestRef = collection(
    firestore,
    "StudentRegistrationRequest"
  );
  const walkingCollectionRef = collection(firestore, "WalkinAppointments");
  const schedulesCollectionRef = collection(firestore, "Schedules");
  const auth = useAuth();
  const notif = useMessage();
  const [user, setUser] = useState(undefined);
  const toastMessage = (message) => toast(message);
  const notifyError = (error) => toast(error.message);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        const user = await getUser(auth.currentUser.uid);
        setUser(user);
      }
    };
    fetchData();
  }, [auth.currentUser]);

  const getUsers = async () => {
    try {
      if (auth.currentUser) {
        if (user) {
          const q = query(
            usersCollectionRef,
            where("department", "==", user.department)
          );
          const usersSnapshot = await getDocs(q);
          const usersData = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return usersData;
        }
      }
    } catch (error) {
      notifyError(error);
    }
  };

  //General
  const getUser = async (UID) => {
    try {
      if (auth.currentUser) {
        const q = query(usersCollectionRef, where("userID", "==", UID));

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
      notifyError(error);
    }
  };

  const getTeachers = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          usersCollectionRef,
          where("role", "in", ["Faculty", "Admin"]),
          where('department', '==', user.department)
        );

        const querySnapshot = await getDocs(q);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return usersData;
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const getAllUsers = async () => {
    try {
      if (auth.currentUser) {
        if (user) {
          console.log(user.department);
          const q = query(
            usersCollectionRef,
            where("department", "==", user.department)
          );
          const usersSnapshot = await getDocs(q);
          const usersData = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return usersData;
        }
      }
    } catch (error) {
      notifyError(error);
    }
  };

  //As Student
  const sendAppointmentRequest = async (
    teacheremail,
    facultyUID,
    concern,
    date,
    time,
    format,
    type
  ) => {
    try {
      if (auth.currentUser) {
        await addDoc(appointmentsRef, {
          appointedFaculty: facultyUID,
          appointee: auth.currentUser.uid,
          appointmentConcern: concern,
          appointmentDate: date,
          appointmentsTime: time,
          appointmentStatus: "Pending",
          appointmentFormat: format,
          appointmentType: type,
          appointmentDuration: 1,
          createdAt: new Date(),
          teacherRemarks: null,
        });

        await notif.storeNotifToDB(
          "Appointment Request",
          concern,
          teacheremail
        );
      }
    } catch (error) {
      notifyError(error);
    }
  };

  //As Admin
  const walkinAppointment = async (
    firstName,
    lastName,
    appointeeType,
    concern,
    date,
    duration,
    remarks
  ) => {
    try {
      if (auth.currentUser) {
        const q = query(walkingCollectionRef);
        await addDoc(q, {
          firstName,
          lastName,
          appointeeType,
          concern,
          date,
          duration,
          remarks,
          createdAt: serverTimestamp(),
          appointedFaculty: auth.currentUser.uid,
        });
        toastMessage("Submitted Succesfuly");
      }
    } catch (error) {
      toastMessage(`Error in storing data to database, ${error.message}`);
    }
  };

  //As teacher
  const getAppointmentRequests = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          appointmentsRef,
          where("appointedFaculty", "==", auth.currentUser.uid)
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
      notifyError(error);
    }
  };

  const getInstructorAppointment = async (uid) => {
    try {
      if (auth.currentUser) {
        const q = query(appointmentsRef, where("appointedFaculty", "==", uid));
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
      notifyError(error);
    }
  };

  const approveAppointment = async (id, receiver, date) => {
    try {
      if (auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = { appointmentStatus: "Accepted" };
        await notif.storeNotifToDB(
          "Accepted Request",
          `You appointment Request has been accepted and will be held on ${date}`,
          receiver
        );
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        toastMessage("Appointment Accepted");
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const denyAppointment = async (id, receiver, reason) => {
    try {
      if (auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = { appointmentStatus: "Denied" };
        await notif.storeNotifToDB("Accepted Request", reason, receiver);
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        toastMessage("Appointment Denied");
      }
    } catch (error) {
      console.error();
    }
  };

  //General
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

  const changeUserProfile = async (imageFile) => {
    if (auth.currentUser) {
      try {
        const storageRef = ref(
          storage,
          `profileImages/${auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });
        await updateDoc(doc(firestore, "Users", auth.currentUser.uid), {
          photoURL: downloadURL,
        });
        console.log("Profile photo updated successfully");
      } catch (error) {
        console.error("Error updating profile photo:", error);
        throw error;
      }
    } else {
      throw new Error("No user is currently signed in");
    }
  };

  //As Admin

  const subscribeToUserChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        if (user) {
          const q = query(
            usersCollectionRef,
            where("department", "==", user.department)
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            const updatedData = data.filter(
              (user) => user.role !== "moderator"
            );
            callback(updatedData);
          });
          return unsubscribe;
        }
      }
    } catch (error) {
      toastMessage("Error subscribing to user changes:", error);
    }
  };

  const subscribeToInstructorChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const q = query(
          usersCollectionRef,
          where("role", "in", ["Faculty", "Admin"]),
          where('department','==', user.department)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const updatedData = data.filter((user) => user.role !== "moderator");
          callback(updatedData);
        });

        return unsubscribe;
      }
    } catch (error) {
      toastMessage("Error subscribing to user changes:", error);
    }
  };

  const editInstructorColorCode = async (id, colorHex) => {
    try {
      if (auth.currentUser) {
        const instructorRef = doc(firestore, "Users", id);
        const updatedInstructorDocRef = { instructorColorCode: colorHex };

        await updateDoc(instructorRef, updatedInstructorDocRef);
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const subscribeToAppointmentChanges = async (status, callback) => {
    try {
      if (auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedFaculty", "==", auth.currentUser.uid),
            where("appointmentStatus", "in", statusArray)
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

  //As admin
  const subscribeToWalkinAppointmentChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            walkingCollectionRef,
            where("appointedFaculty", "==", auth.currentUser.uid)
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
      } else {
        console.warn("No current user found.");
        return () => {};
      }
    } catch (error) {
      console.error(
        "Error in subscribing to walk-in appointment changes:",
        error
      );
      return () => {};
    }
  };

  const subscribeToMessageChanges = async (callback) => {
    if (auth.currentUser) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          orderBy("createAt", "desc"),

          where(
            "participants",
            "array-contains",
            auth.currentUser.displayName,
            auth.currentUser.email
          ),
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

  //As student
  const subscribeToRequestedAppointmentChanges = async (status, callback) => {
    try {
      if (auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointee", "==", auth.currentUser.uid),
            where("appointmentStatus", "in", statusArray)
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

  //General
  const getAppointmentList = async () => {
    try {
      if (auth.currentUser) {
        const usersSnapshot = await getDocs(appointmentsRef);
        const appointmentData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return appointmentData;
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const getPendingRegistrationRequests = async () => {
    try {
      if (auth.currentUser) {
        if (user) {
          const q = query(
            studentRegistrationRequestRef,
            where("department", "==", user.department)
          );
          const usersSnapshot = await getDocs(q);
          const pendingRegData = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return pendingRegData;
        }
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const setInstructorSchedule = async (day, timeslot, assignedInstructor) => {
    try {
      const dayRef = doc(firestore, "Schedules", day.id);

      await addDoc(collection(dayRef, "timeslots"), {
        time: timeslot,
        assignedInstructor: assignedInstructor,
        available: true,
        createdAt: Timestamp.now(),
      });
      await notif.storeNotifToDB(
        "Consultation Schedules",
        `Your consultation hours Schedule has been updated, please proceed to schedules pages to view your new consultation schedules`,
        assignedInstructor.email
      );
    } catch (error) {
      toastMessage("Error adding document: ", error.message);
    }
  };

  const getDays = async () => {
    try {
      if (auth.currentUser) {
        const schedulesSnapshot = await getDocs(schedulesCollectionRef);
        const schedulesData = schedulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        schedulesData.sort((a, b) => a.createdAt - b.createdAt);

        return schedulesData;
      }
    } catch (error) {
      toastMessage("Error in getting schedules list:", error.message);
    }
  };

  const getInstructorSchedule = async (email) => {
    try {
      if (auth.currentUser) {
        const q = query(
          schedulesCollectionRef,
          where("assignedInstructor.email", "==", email)
        );
        const querySnapshot = await getDocs(q);
        const scheduleData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (scheduleData) {
          return scheduleData;
        } else {
          return console.log("No schedule data");
        }
      }
    } catch (error) {
      toastMessage("Error in retrieving teacher schedules:", error.message);
    }
  };

  const getScheduleDay = async (day) => {
    try {
      if (auth.currentUser) {
        const q = query(schedulesCollectionRef, where("dayOfWeek", "==", day));
        const querySnapshot = await getDocs(q);
        const scheduleDayData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(scheduleDayData);
        if (scheduleDayData) {
          return scheduleDayData;
        } else {
          return console.log("No schedule data");
        }
      }
    } catch (error) {
      toastMessage("Error in retrieving schedule day:", error.message);
    }
  };

  const deleteSchedule = async (scheduleID) => {
    //   try {
    //     if (auth.currentUser) {
    //       const scheduleDoc = doc(collection(firestore, "Schedules"), scheduleID);
    //       await deleteDoc(scheduleDoc);
    //     }
    //   } catch (error) {
    //     toastMessage("Error in updating Schedule:", error.message);
    //   }
    // };
    // const updateScheduleData = async (instructor, id) => {
    //   try {
    //     const schedulesDocRef = doc(firestore, "Schedule", id);
    //     const updatedSchedulesDocRef = { assignedInstructor: instructor };
    //     return await updateDoc(schedulesDocRef, updatedSchedulesDocRef);
    //   } catch (error) {
    //     toastMessage(error.message);
    //   }
  };

  const subscribeToSchedulesChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(schedulesCollectionRef, (snapshot) => {
          const schedulesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(schedulesData);
        });
        return unsubscribe;
      }
    } catch (error) {
      toastMessage("Error subscribing to schedule changes:", error);
    }
  };

  const getTimeslotsForDay = async (day) => {
    try {
      const dayRef = doc(firestore, "Schedules", day.id);
      const timeslotsRef = collection(dayRef, "timeslots");

      const q = query(timeslotsRef);
      const querySnapshot = await getDocs(q);

      const timeslots = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return timeslots;
    } catch (error) {
      console.error("Error getting timeslots: ", error.message);
      return [];
    }
  };

  const getInstructorTimeslots = async (day, email) => {
    try {
      const dayRef = doc(firestore, "Schedules", day.id);
      const timeslotsRef = collection(dayRef, "timeslots");

      if (auth.currentUser) {
        const q = query(
          timeslotsRef,
          where("assignedInstructor.email", "==", email)
        );
        const querySnapshot = await getDocs(q);

        const timeslotData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (timeslotData) {
          return timeslotData;
        } else {
          return console.log("No schedule data");
        }
      }
    } catch (error) {
      toastMessage("Error in retrieving teacher schedules:", error.message);
    }
  };

  const subscribeToTimeslotChanges = async (callback, day) => {
    try {
      if (auth.currentUser) {
        const dayRef = doc(firestore, "Schedules", day.id);
        const timeslotsCollectionRef = collection(dayRef, "timeslots");

        const unsubscribe = onSnapshot(timeslotsCollectionRef, (snapshot) => {
          const timeslotsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(timeslotsData);
        });
        return unsubscribe;
      }
    } catch (error) {
      toastMessage("Error subscribing to timeslot changes:", error);
    }
  };

  const value = {
    getUsers,
    getUser,
    getTeachers,
    getAllUsers,
    sendAppointmentRequest,
    walkinAppointment,
    subscribeToWalkinAppointmentChanges,
    getAppointmentRequests,
    getInstructorAppointment,
    approveAppointment,
    denyAppointment,
    editInstructorColorCode,
    getMessages,
    sendMessage,
    getDays,
    getScheduleDay,
    getTimeslotsForDay,
    getInstructorSchedule,
    getInstructorTimeslots,
    // updateScheduleData,
    deleteSchedule,
    changeUserProfile,
    setInstructorSchedule,
    subscribeToTimeslotChanges,
    getAppointmentList,
    getPendingRegistrationRequests,
    subscribeToAppointmentChanges,
    subscribeToMessageChanges,
    subscribeToRequestedAppointmentChanges,
    subscribeToUserChanges,
    subscribeToInstructorChanges,
    subscribeToSchedulesChanges,
  };

  return (
    <dbContext.Provider value={value}>
      {children}
      <Toaster />
    </dbContext.Provider>
  );
};
