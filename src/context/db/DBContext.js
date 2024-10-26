import React, { useContext, createContext, useEffect, useState } from "react";
import { startOfDay, endOfDay } from "date-fns";
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
  deleteDoc,
  
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

  const schedulesCollectionRef = collection(firestore, "Schedules");
  const consultationReportRef = collection(firestore, "ConsultationReports");
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

  const getGuidance = async () => {
    try{
      const q = query(usersCollectionRef, where('role', '==', 'Guidance'), limit(1))
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return userData;
    }catch(error){
      toastMessage(`Errr in retreiving guidance counselor info, ${error.message}`)
    }
  }

  const getTeachers = async () => {
    try {
      if (auth.currentUser) {
        const q = query(
          usersCollectionRef,
          where("role", "in", ["Faculty", "Admin"]),
          where("department", "==", user.department)
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
          department: user.department,
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

  //General
  const cancelAppointment = async (id) => {
    try{
      if (auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = { appointmentStatus: "Cancelled", updateMessage: `This Appointment was cancelled by ${auth.currentUser.firstName} ${auth.currentUser.lastName}` };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        toastMessage("Appointment Cancelled");
      }
    }catch(error){
      console.log("Error occured in canceling appointment")
    }
  }

  //As Admin
  const walkinAppointment = async (
    firstName,
    lastName,
    email,
    appointeeType,
    concern,
    date,
    duration,
    remarks
  ) => {
    try {
      if (auth.currentUser) {
        const q = query(appointmentsRef);
        await addDoc(q, {
          appointee: {
            firstName,
            lastName,
            email,
            department: user.department,
            role: appointeeType,
          },
          appointeeType,
          appointmentConcern: concern,
          appointmentDate: date,
          appointmentDuration: duration,
          teacherRemarks: remarks,
          appointmentFormat: "Walkin",
          appointmentStatus: 'Recorded',
          createdAt: serverTimestamp(),
          appointedFaculty: auth.currentUser.uid,
        });
        toastMessage("Submitted Succesfuly");
      }
    } catch (error) {
      toastMessage(`Error in storing data to database, ${error.message}`);
    }
  };

  const makeReferal = async (firstName, lastName, email, referee, department, concern, concernType, date) => {
    try{
      if(auth.currentUser){
        const q = query(appointmentsRef)
        await addDoc(q, {
          appointee : {
            firstName,
            lastName,
            email,
            department,
          },
          appointedFaculty: auth.currentUser.uid,
          referee,
          appointmentDate: date,
          appointmentFormat: 'Referal', 
          department: user.department,
          appointmentConcern: concern,
          appointmentType: concernType,
          createdAt: serverTimestamp(),

        })
      }
    }catch(error){
      throw new Error(`Error in making referal ${error.message}`)
    }
  }

  const makeWalkin = async (firstName, lastName,email, date, concern, concernType, department) => {
    try{
      if(auth.currentUser){
        const q = query(appointmentsRef)
        await addDoc(q, {
          appointee : {
            firstName,
            lastName,
            email,
            department,
          },
          appointedFaculty: auth.currentUser.uid,
          appointmentDate: date,
          appointmentFormat: 'Walkin', 
          appointmentType: 'Face to Face',
          department: user.department,
          appointmentConcern: concern,
          appointmentType: concernType,
          createdAt: serverTimestamp(),

        })
      }
    }catch(error){
      throw new Error(`Error in making referal ${error.message}`)
    }
  }

  //As dean
  const uploadESignature = async (imageFile) => {
    try {
      if (auth.currentUser) {
        const storageRef = ref(storage, `eSignatures/${auth.currentUser.uid}`);

        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(usersCollectionRef, auth.currentUser.uid);
        await updateDoc(userDocRef, { eSignature: downloadURL });

        toastMessage("E-signature uploaded successfully!");
      }
    } catch (error) {
      toastMessage(`Error in uploading E-signature: ${error.message}`);
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

  const getAppointment = async (id) => {
    try {
      if (auth.currentUser) {
        const q = query(appointmentsRef, where("id", "==", id));
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
        const updatedAppointmentDocRef = { appointmentStatus: "Accepted", updateMessage: `This Appointment was approved by ${auth.currentUser.firstName} ${auth.currentUser.lastName}` };
        await notif.storeNotifToDB(
          "Appointment Accepted",
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
        const updatedAppointmentDocRef = { appointmentStatus: "Denied", updateMessage: `This Appointment was denied by ${auth.currentUser.firstName} ${auth.currentUser.lastName}` };
        await notif.storeNotifToDB("Appoitnment Denied", reason, receiver);
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        toastMessage("Appointment Denied");
      }
    } catch (error) {
      console.error();
    }
  };

  const followupAppointment = async (
    id,
    receiver,
    format,
    date,
    appointmentsTime,
    location
  ) => {
    try {
      if (auth.currentUser) {
        const recevingUser = await getUser(receiver);

        const oldAppointmentRef = doc(appointmentsRef, id);
        await updateDoc(oldAppointmentRef, { appointmentStatus: "Followup" });
    
        await addDoc(appointmentsRef, {
          precedingAppt: id,
          appointee: receiver,
          appointedFaculty: auth.currentUser.uid,
          appointmentDate: date,
          appointmentFormat: format,
          appointmentsTime,
          location,
          createdAt: serverTimestamp(),
          department: user.department,
        });
        if (recevingUser) {
          await notif.storeNotifToDB(
            "Appointment",
            `A follow up appointment has been made between ${
              auth.currentUser.displayName
            } and you. ${
              location ? `Appointment will be held at ${location}` : ""
            }`,
            recevingUser.email
          );
        }
      }
    } catch (error) {
      notifyError(`Error creating follow-up appointment: ${error.message}`);
    }
  };

  const walkinScheduleAppointment = async (
    firstName,
    lastName,
    email,
    date,
    time,
    type
  ) => {
    try {
      if (auth.currentUser) {
        await addDoc(appointmentsRef, {
          appointee: { firstName, lastName, email, department: user.department, appointeeType: type},
          appointedFaculty: auth.currentUser.uid,
          appointmentDate: date.dateWithoutTime,
          appointmentsTime: time,
          createdAt: serverTimestamp(),
          department: user.department,  
          appointmentFormat: "Walkin",
          appointmentStatus: "Pending",
          appointmentType: type,
        });
      }
    } catch (error) {
      notifyError(`Error scheduling walkin appointment: ${error.message}`);
    }
  };

  const finishAppointment = async (id, receiver) => {
    try {
      if (auth.currentUser) {
        const recevingUser = await getUser(receiver);
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = { appointmentStatus: "Finished", updateMessage: `This Appointment was marked finished by ${auth.currentUser.firstName} ${auth.currentUser.lastName}` };

        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        if (recevingUser) {
          await notif.storeNotifToDB(
            "Appointment",
            `You appointment with ${auth.currentUser.displayName} has been marked finished`,
            recevingUser.email
          );
        }
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const makeReport = async (
    id,
    remarks,
    date,
    duration,
    mode,
    radio,
    agenda,
    summary,
    receiver
  ) => {
    try {
      if (auth.currentUser) {

        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = { teacherRemarks: remarks };
        const reportRef = collection(appointmentDocRef, "Reports");
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef)
        await addDoc(reportRef, {
          remarks,
          date,
          duration,
          mode,
          radio,
          agenda,
          summary,
          receiver,
          ReportBy: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      toastMessage("Error in making report: ", error.message);
    }
  };

  const rateExperiences = async (
    fid,
    facultyRating,
    facultyfeedback,
    aid,
    consultationRating,
    consultationfeedback
  ) => {
    try {
      const userDocRef = doc(usersCollectionRef, fid);

      const facultyRatingRef = collection(userDocRef, "FacultyRating");

      const appointmentRatingRef = collection(firestore, "AppointmentRating");

      if (auth.currentUser) {
        await addDoc(facultyRatingRef, {
          facultyRating,
          facultyfeedback,
        });

        await addDoc(appointmentRatingRef, {
          appointmentID: aid,
          consultationRating,
          consultationfeedback,
        });
      }
    } catch (error) {
      toastMessage("Error in sending rating: ", error.message);
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

  const attachFile = async (file, uid, receiver) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const generateRandomString = () => {
      const length = Math.floor(Math.random() * 10) + 1;
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    };
    try {
      if (auth.currentUser) {
        const storageRef = ref(
          storage,
          `messageAttachments/${
            auth.currentUser.uid
          }-${generateRandomString()}-${file.name}`
        );
        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        const fileType = file.type;
        await addDoc(messagesRef, {
          file: { fileAttachment: downloadURL, fileType },
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
          where("department", "==", user.department)
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
            where("appointmentStatus", "in", statusArray),
            where("appointmentFormat", "!=", "Walkin")
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

  const subscribeToAllAppointmentChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(appointmentsRef, where("department", "==", user.department)),
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

  const subscribeToUserAppointmentChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(appointmentsRef, where("appointedFaculty", "==", auth.currentUser.uid)),
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

  const subscribeToTodayAppointmentChanges = async (callback) => {
    try {
      if (auth.currentUser) {
        const today = new Date();
        const startStr = formatDate(startOfDay(today));
        const endStr = formatDate(endOfDay(today));

        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("department", "==", user.department),
            where("appointmentDate", ">=", startStr),
            where("appointmentDate", "<=", endStr)
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
      console.error(error);
    }
  };

  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "UTC",
      hour12: false,
    };
    return date.toLocaleString("en-US", options) + " UTC+8";
  }

  //As admin
  const subscribeToWalkinAppointmentChanges = async (status, callback) => {
    try {
      if (auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointmentFormat", "==", "Walkin"),
            where('appointmentStatus', 'in', statusArray),
            where('appointedFaculty', '==', auth.currentUser.uid)
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

  const subscribeToSCSChanges = async (format,callback) => {
    try {
      if (auth.currentUser) {
        const formatArray = Array.isArray(format) ? format : [format];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointmentFormat", "in", formatArray),
            where('appointedFaculty' ,'==', auth.currentUser.uid)
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
            where("department", "==", user.department),
            where("status", "==", "Pending")
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

  const denyRegistration = async (id,denyMessage, receiver) => {
    try {
      if (auth.currentUser) {
        const registrationDocRef = doc(firestore, "StudentRegistrationRequest", id);
        const updatedRegistrationDocRef = { status: "Denied", updateMessage: `This Appointment was denied by ${auth.currentUser.firstName} ${auth.currentUser.lastName}` };
        await notif.storeNotifToDB("Registration Denied", denyMessage, receiver);
        await updateDoc(registrationDocRef, updatedRegistrationDocRef);
        toastMessage("Registration Denied");
      }
    } catch (error) {
      console.log("Error has occured")
    }
  };

  const subscribetoPendingRegistration = async (callback) => {
    try {
      if (auth.currentUser) {
        const q = query(
          studentRegistrationRequestRef,
          where("department", "==", user.department),
          where("status", "==", "Pending")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const pendingRegData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(pendingRegData);
        });
        return unsubscribe;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [notifSent, setNotifSent] = useState(false);
  const setInstructorSchedule = async (day, timeslot, assignedInstructor) => {
    try {
      const dayRef = doc(firestore, "Schedules", day.id);

      await addDoc(collection(dayRef, "timeslots"), {
        time: timeslot,
        assignedInstructor: assignedInstructor,
        available: true,
        createdAt: Timestamp.now(),
      });
      if (!notifSent) {
        await notif.storeNotifToDB(
          "Schedules",
          `Your consultation hours Schedule has been updated, please proceed to schedules pages to view your new consultation schedules`,
          assignedInstructor.email
        );
      }
      setNotifSent(true);
    } catch (error) {
      toastMessage("Error adding document: ", error.message);
      setNotifSent(false);
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

  const deleteSchedule = async (timeslotID, day) => {
    try {
      if (auth.currentUser) {
        const dayRef = doc(firestore, "Schedules", day);
        const timeslotsCollectionRef = collection(dayRef, "timeslots");
        const timeslotDocRef = doc(timeslotsCollectionRef, timeslotID);
        await deleteDoc(timeslotDocRef);
      } else {
        console.log("No authenticated user");
      }
    } catch (error) {
      console.error("Error in deleting schedule", error.message);
    }
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

  const getFacultyRatings = async (id) => {
    if (auth.currentUser) {
      try {
        const userRef = doc(firestore, "Users", id);
        const userRatingRef = collection(userRef, "FacultyRating");

        if (auth.currentUser) {
          const q = query(userRatingRef);
          const querySnapshot = await getDocs(q);

          const ratingData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (ratingData) {
            return ratingData;
          } else {
            return console.log("No schedule data");
          }
        }
      } catch (error) {
        toastMessage("Error in fetching ratings: ", error.message);
      }
    }
  };

  const subscribeToRatingChanges = async (callback, id) => {
    try {
      if (auth.currentUser) {
        const userRef = doc(firestore, "Users", id);
        const userRatingRef = collection(userRef, "FacultyRating");

        const unsubscribe = onSnapshot(userRatingRef, (snapshot) => {
          const ratingData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback(ratingData);
        });
        return unsubscribe;
      }
    } catch (error) {
      toastMessage("Error subscribing to timeslot changes:", error);
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
  const subscribeToGuidanceTimeslotChanges = async (callback, day) => {
    try {
      if (auth.currentUser) {
        const dayRef = doc(firestore, "Schedules", day.id);
        const timeslotsCollectionRef = collection(dayRef, "timeslots");
        const q = query(timeslotsCollectionRef, where('assignedInstructor.userID', '==', auth.currentUser.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
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
    getGuidance,
    getTeachers,
    getAllUsers,
    sendAppointmentRequest,
    cancelAppointment,
    getAppointment,
    walkinAppointment,
    makeReferal,
    makeWalkin,
    uploadESignature,
    subscribeToWalkinAppointmentChanges,
    subscribeToSCSChanges,
    getAppointmentRequests,
    getInstructorAppointment,
    approveAppointment,
    denyAppointment,
    denyRegistration,
    followupAppointment,
    walkinScheduleAppointment,
    finishAppointment,
    makeReport,
    rateExperiences,
    editInstructorColorCode,
    getMessages,
    sendMessage,
    attachFile,
    getDays,
    getScheduleDay,
    getTimeslotsForDay,
    getInstructorSchedule,
    getInstructorTimeslots,
    getFacultyRatings,
    subscribeToRatingChanges,
    // updateScheduleData,
    deleteSchedule,
    changeUserProfile,
    setInstructorSchedule,
    subscribeToTimeslotChanges,
    getAppointmentList,
    getPendingRegistrationRequests,
    subscribetoPendingRegistration,
    subscribeToAppointmentChanges,
    subscribeToAllAppointmentChanges,
    subscribeToUserAppointmentChanges,
    subscribeToTodayAppointmentChanges,
    subscribeToMessageChanges,
    subscribeToRequestedAppointmentChanges,
    subscribeToUserChanges,
    subscribeToInstructorChanges,
    subscribeToSchedulesChanges,
    setNotifSent,
    subscribeToGuidanceTimeslotChanges,
  };

  return (
    <dbContext.Provider value={value}>
      {children}
      <Toaster />
    </dbContext.Provider>
  );
};
