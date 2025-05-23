import React, { useContext, createContext, useEffect, useState } from "react";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
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
  getDoc,
} from "firebase/firestore";
import { firestore, storage, auth } from "../../server/firebase";
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
  const Auth = useAuth();
  const notif = useMessage();
  const [user, setUser] = useState(undefined);
  const toastMessage = (message) => toast(message);
  const notifyError = (error) => toast(error.message);

  useEffect(() => {
    const fetchData = async () => {
      if (Auth.currentUser) {
        setUser(Auth.currentUser);
      }
    };
    fetchData();
  }, [Auth.currentUser]);

  const getUsers = async () => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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
    try {
      const q = query(
        usersCollectionRef,
        where("role", "==", "Guidance"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return userData;
    } catch (error) {
      toastMessage(
        `Errr in retreiving guidance counselor info, ${error.message}`
      );
    }
  };

  const getTeachers = async () => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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

  const createLogs = async (type, appointmentId, formValue) => {
    if (!Auth.currentUser) {
      return { message: "User is not authenticated", status: "failed" };
    }

    const logsCollectionRef = collection(firestore, "ActionLogs");

    const logDetails = {
      type,
      action: formValue.action || "No action description provided",
      appointmentId,
      performedBy: Auth.currentUser.uid || "Anonymous",
      targetUser:
        Auth.currentUser.role === "student"
          ? formValue.appointedFaculty
          : formValue.appointee ||
            formValue.appointee?.firstName + formValue.appointee?.lastName,
      timestamp: Date.now(),
      details: formValue || {},
      status: "pending",
      notes: formValue.notes || null,
    };

    try {
      await addDoc(logsCollectionRef, logDetails);
      return { message: "Successfully created action log", status: "success" };
    } catch (error) {
      logDetails.status = "failed";
      logDetails.errorMessage = error.message;

      await addDoc(logsCollectionRef, logDetails);
      return { message: "Could not create action log", status: "failed" };
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
    type,
    department
  ) => {
    try {
      const formValues = {
        appointedFaculty: facultyUID,
        appointee: Auth.currentUser.uid,
        appointmentConcern: concern,
        appointmentDate: date,
        appointmentsTime: time,
        appointmentStatus: "Pending",
        appointmentFormat: format,
        appointmentType: type,
        appointmentDuration: 1,
        createdAt: new Date(),
        teacherRemarks: null,
        department,
      };
      if (Auth.currentUser) {
        const docRef = await addDoc(appointmentsRef, formValues);

        await createLogs("SEND_REQUEST", docRef.id, {
          ...formValues,
          action: "Sent Appointment Request",
        });

        await notif.storeNotifToDB(
          "Appointment Request",
          concern,
          teacheremail
        );
      }
    } catch (error) {
      toast.error(error);
    }
  };

  //General
  const cancelAppointment = async (id, reason, sendTo) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);

        const updatedAppointmentDocRef = {
          appointmentStatus: "Cancelled",
          updateMessage: `This Appointment was cancelled by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
          reason,
        };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("CANCEL", id, {
          ...updatedAppointmentDocRef,
          action: "Cancelled Appointment",
        });
        await notif.storeNotifToDB("Appointment Cancelled", reason, sendTo);
        return {
          message: "Successfully cancelled appointment",
          status: "success",
        };
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      return {
        message: "Error occurred in cancelling appointment",
        status: "failed",
      };
    }
  };

  //As Admin
  const walkinAppointment = async (
    firstName,
    lastName,
    email,
    appointeeType,

    issues,
    rootcause,
    recommendation,
    expectedOutcome,

    concern,
    date,
    duration,
    remarks
  ) => {
    try {
      if (Auth.currentUser) {
        const formValues = {
          appointee: {
            firstName,
            lastName,
            email,
            department: user.department,
            role: appointeeType,
          },
          appointeeType,
          issues,
          rootcause,
          recommendation,
          expectedOutcome,
          appointmentConcern: concern,
          appointmentDate: date,
          appointmentDuration: duration,
          teacherRemarks: remarks,
          appointmentFormat: "Walkin",
          appointmentStatus: "Recorded",
          createdAt: serverTimestamp(),
          appointedFaculty: Auth.currentUser.uid,
        };
        const q = query(appointmentsRef);
        const docRef = await addDoc(q, formValues);

        await createLogs("RECORD", docRef.id, {
          ...formValues,
          action: "Create walkin data",
        });
        return {
          message: "Successfully created walkin data",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error occurred in creating walkin data",
        status: "failed",
      };
    }
  };

  const makeReferal = async (
    guardianName,
    guardianPhoneNumber,
    firstName,
    lastName,
    email,
    referee,
    department,
    concernType,
    date,
    yearLevel,
    age,
    sessionNumber,
    location,
    observation,
    nonVerbalCues,
    summary,
    techniques,
    actionPlan,
    evaluation
  ) => {
    try {
      if (Auth.currentUser) {
        const q = query(appointmentsRef);
        const formValues = {
          appointee: {
            firstName,
            lastName,
            email,
            department,
          },
          guardianName,
          guardianPhoneNumber,
          appointedFaculty: Auth.currentUser.uid,
          referee,
          appointmentDate: date,
          appointmentFormat: "Referral",
          appointmentStatus: "Recorded",
          department: user.department,
          appointmentType: concernType,
          yearLevel,
          age,
          sessionNumber,
          location,
          observation,
          nonVerbalCues,
          summary,
          techniques,
          actionPlan,
          evaluation,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(q, formValues);
        await createLogs("RECORD", docRef.id, {
          ...formValues,
          action: "Create walkin data",
        });
        return {
          message: "Successfully created referral data",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error occurred in making referral data",
        status: "failed",
      };
    }
  };

  const makeWalkin = async (
    guardianName,
    guardianPhoneNumber,
    firstName,
    lastName,
    email,
    department,
    concernType,
    date,
    yearLevel,
    age,
    sessionNumber,
    location,
    observation,
    nonVerbalCues,
    summary,
    techniques,
    actionPlan,
    evaluation
  ) => {
    try {
      if (Auth.currentUser) {
        const formValues = {
          appointee: {
            firstName,
            lastName,
            email,
            department,
          },
          guardianName,
          guardianPhoneNumber,
          appointedFaculty: Auth.currentUser.uid,
          appointmentDate: date,
          appointmentFormat: "Walkin",
          appointmentStatus: "Recorded",
          department: user.department,
          appointmentType: concernType,
          yearLevel,
          age,
          sessionNumber,
          location,
          observation,
          nonVerbalCues,
          summary,
          techniques,
          actionPlan,
          evaluation,
          createdAt: serverTimestamp(),
        };
        const q = query(appointmentsRef);
        const docRef = await addDoc(q, formValues);
        await createLogs("RECORD", docRef.id, {
          ...formValues,
          action: "Create walkin data",
        });
        return {
          message: "Successfully created walkin data",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error in creating walkin data",
        status: "failed",
      };
    }
  };

  //As dean
  const uploadESignature = async (imageFile) => {
    try {
      if (Auth.currentUser) {
        const storageRef = ref(storage, `eSignatures/${Auth.currentUser.uid}`);

        await uploadBytes(storageRef, imageFile);
        const downloadURL = await getDownloadURL(storageRef);

        const userDocRef = doc(usersCollectionRef, Auth.currentUser.uid);
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
      if (Auth.currentUser) {
        const q = query(
          appointmentsRef,
          where("appointedFaculty", "==", Auth.currentUser.uid)
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const docRef = doc(appointmentsRef, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.log("No such document!");
          return null;
        }
      }
    } catch (error) {
      notifyError(error);
      return null;
    }
  };

  const getAppointmentReport = async (id) => {
    try {
      if (Auth.currentUser) {
        const docRef = doc(appointmentsRef, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const reportRef = collection(docRef, "Reports");
          const q = query(reportRef);
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const reportDoc = querySnapshot.docs[0];
            return {
              id: reportDoc.id,
              ...reportDoc.data(),
              appointmentData: { id: docSnap.id, ...docSnap.data() },
            };
          } else {
            console.log("No report found for this appointment!");
            return null;
          }
        } else {
          console.log("No such appointment document!");
          return null;
        }
      }
    } catch (error) {
      notifyError(error);
      return null;
    }
  };

  const getAppointmentRecords = async (id) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const appointmentDocSnap = await getDoc(appointmentDocRef);

        if (appointmentDocSnap.exists()) {
          const followupCollectionRef = collection(
            appointmentDocRef,
            "Followup"
          );
          const followupSnapshot = await getDocs(followupCollectionRef);

          const followupRecords = followupSnapshot.docs.map((doc) =>
            doc.data()
          );

          const appointment = appointmentDocSnap.data();

          const result = [
            {
              ...appointment,
              id,
              followup: followupRecords,
            },
          ];

          return result;
        } else {
          console.log("Appointment not found");
        }
      }
    } catch (error) {
      console.log("Error in getting appointment records:", error);
    }
  };

  const getFinishedFacultyAppointment = async (id) => {
    try {
      if (Auth.currentUser) {
        const now = new Date();
        const startDate = startOfMonth(now).toISOString().split("T")[0];
        const endDate = endOfMonth(now).toISOString().split("T")[0];

        const q = query(
          appointmentsRef,
          where("appointedFaculty", "==", id),
          where("appointmentStatus", "==", "Finished"),
          where("appointmentDate", ">=", startDate),
          where("appointmentDate", "<=", endDate)
        );

        const querySnapshot = await getDocs(q);
        const appointmentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return appointmentData || [];
      }
    } catch (error) {
      notifyError(error);
    }
  };

  const approveAppointment = async (id, receiver, date) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = {
          appointmentStatus: "Accepted",
          department: Auth.currentUser.department,
          updateMessage: `This Appointment was approved by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
        };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("APPROVE", id, {
          ...updatedAppointmentDocRef,
          action: "Approve Appointment Request",
        });
        await notif.storeNotifToDB(
          "Appointment Accepted",
          `Your appointment Request has been accepted and will be held on ${date}`,
          receiver
        );
        return {
          message: "Successfuly approved appointment",
          status: "success",
        };
      }
    } catch (error) {
      return { message: "Error in approving appointment", status: "failed" };
    }
  };

  const acceptResched = async (id, receiver) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const receiverData = await getUser(receiver);
        const appt = await getAppointment(id);
        const updatedAppointmentDocRef = {
          isRescheduled: false,
          appointmentDate: appt.newSched.appointmentDate,
          appointmentsTime: appt.newSched.appointmentsTime,
          newSched: null,
          acceptedAt: serverTimestamp(),
          appointmentStatus: "Accepted",
          updateMessage: `This Appointment reschedule was accepted by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}. Your Appointment will e held at ${appt.newSched.appointmentDate} in ${appt.newSched.appointmentsTime.appointmentStartTime} AM`,
        };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("RESCHEDULE", id, {
          ...updatedAppointmentDocRef,
          action: "Accepted Re-schedule of appointment",
        });
        await notif.storeNotifToDB(
          "Appointment Resched|Accepted",
          `Your appointment rescheduled was accepted ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
          receiverData.email
        );
        return { message: "Accepted Resched Date and Time", status: "success" };
      }
    } catch (error) {
      return {
        message: "Error in accepting resched date and time",
        status: "failed",
      };
    }
  };

  const reschedAppointment = async (
    id,
    receiver,
    reason,
    appointmentDate,
    appointmentsTime
  ) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const receiverData = await getUser(receiver);
        const appt = await getAppointment(id);
        const updatedAppointmentDocRef = {
          newSched: { appointmentDate, appointmentsTime },
          oldSched: {
            appointmentDate: appt.appointmentDate,
            appointmentsTime: appt.appointmentsTime,
          },
          rescheduledAt: serverTimestamp(),
          isRescheduled: true,
          rescheduledBy:
            Auth.currentUser.role === "Student" ? "appointee" : "appointed",
          reason,
          appointmentStatus: "Pending",
          updateMessage: `This Appointment was rescheduled by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}. Your Appointment will e held at ${appointmentDate} in ${appointmentsTime.appointmentStartTime} AM`,
        };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("RESCHEDULE", id, {
          ...updatedAppointmentDocRef,
          action: "Re schedule appointment",
        });
        await notif.storeNotifToDB(
          "Appointment Rescheduled",
          `Your appointment has been rescheduled by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName} because: ${reason}`,
          receiverData.email
        );
        return {
          message: "The appointment has been succesfully rescheduled",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "An error occured rescheduling the appointment",
        status: "failed",
      };
    }
  };

  const denyAppointment = async (id, receiver, reason) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = {
          appointmentStatus: "Denied",
          updateMessage: `This Appointment was denied by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
        };
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("DENY", id, {
          ...updatedAppointmentDocRef,
          action: "Denied appointment",
        });
        await notif.storeNotifToDB(
          "Appointment Denied",
          `You appointment Request has been denied because: ${reason}`,
          receiver
        );
        toastMessage("Appointment Denied");
      }
    } catch (error) {
      console.error();
    }
  };

  const markAppointmentNoShow = async (id, receiver) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const updatedAppointmentDocRef = {
          appointmentStatus: "NOSHOW",
          updateMessage: `You did not anwser the call attempt of ${Auth.currentUser.displayName}`,
        };
        const user = await getUser(receiver);
        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("NOSHOW", id, {
          ...updatedAppointmentDocRef,
          action: "Marked appointment as NO SHOW",
        });
        await notif.storeNotifToDB(
          "Appointment NOSHOW",
          `You appointment with ${Auth.currentUser.displayName} was marked as a NO SHOW because you did not answer the call attempt.`,
          user.email
        );
        return {
          message: "Successfully marked appointment as No SHOW",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error in marking appointment as No SHOW",
        status: "failed",
      };
    }
  };

  const followupAppointment = async (
    id,
    curID = null,
    receiver,
    format,
    date,
    appointmentsTime,
    location
  ) => {
    try {
      if (!Auth.currentUser) return;
      const receivingUser = await getUser(receiver);
      const oldAppointmentRef = doc(appointmentsRef, id);
      const appointmentToUpdateRef = curID
        ? doc(oldAppointmentRef, "Followup", curID)
        : oldAppointmentRef;
      const appointmentData = await getDoc(appointmentToUpdateRef);
      if (!appointmentData.exists()) {
        throw new Error(`Appointment with ID ${curID || id} does not exist.`);
      }
      await updateDoc(appointmentToUpdateRef, {
        appointmentStatus: "Finished",
      });
      const followupAppointmentRef = collection(oldAppointmentRef, "Followup");
      const precedingApptdata = await getAppointment(id);

      if (precedingApptdata) {
        const formValues = {
          precedingAppt: id,
          appointee: receiver,
          appointedFaculty: Auth.currentUser.uid,
          appointmentDate: date,
          appointmentFormat: format,
          appointmentStatus: "Followup",
          appointmentType: precedingApptdata?.appointmentType || null,
          appointmentsTime,
          appointmentConcern:
            precedingApptdata?.precedingAppt?.appointmentConcern ||
            precedingApptdata.appointmentConcern ||
            null,
          location,
          createdAt: serverTimestamp(),
          department: user.department,
        };
        const docRef = await addDoc(followupAppointmentRef, formValues);
        if (receivingUser) {
          await createLogs("FOLLOWUP", docRef.id, {
            ...formValues,
            action: "Followup appointment",
          });
          await notif.storeNotifToDB(
            "Appointment Followup",
            `A follow-up appointment has been made between ${
              Auth.currentUser.displayName
            } and you. ${
              location ? `Appointment will be held at ${location}` : ""
            }`,
            receivingUser.email
          );
        }
      }
    } catch (error) {
      console.error("Error creating follow-up appointment:", error);
      toastMessage(`Error creating follow-up appointment: ${error.message}`);
    }
  };

  const guidanceFollowupRecord = async (
    id,
    firstName,
    lastName,
    email,
    format,
    department,
    concernType,
    date,
    yearLevel,
    age,
    sessionNumber,
    location,
    observation,
    nonVerbalCues,
    summary,
    techniques,
    actionPlan,
    evaluation
  ) => {
    try {
      if (Auth.currentUser) {
        const oldAppointmentRef = doc(appointmentsRef, id);

        const followupRef = collection(oldAppointmentRef, "Followup");
        const formValues = {
          appointee: {
            firstName,
            lastName,
            email,
            department,
          },
          appointedFaculty: Auth.currentUser.uid,
          appointmentDate: date,
          appointmentFormat: format,
          department: user.department,
          appointmentType: concernType,
          yearLevel,
          age,
          sessionNumber,
          location,
          observation,
          nonVerbalCues,
          summary,
          techniques,
          actionPlan,
          evaluation,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(followupRef, formValues);
        await createLogs("FOLLOWUP", docRef.id, {
          ...formValues,
          action: "Followup appointment",
        });
        return {
          message: "Successfully scheduled follow up appointment",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error occurred in scheduling followup appointment ",
        status: "failed",
      };
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
      if (Auth.currentUser) {
        const formValues = {
          appointee: {
            firstName,
            lastName,
            email,
            department: user.department,
            appointeeType: type,
          },
          appointedFaculty: Auth.currentUser.uid,
          appointmentDate: date,
          appointmentsTime: {
            appointmentStartTime: time.appointmentStartTime,
            appointmentEndTime: time.appointmentEndTime,
          },
          createdAt: serverTimestamp(),
          department: user.department,
          appointmentFormat: "Walkin",
          appointmentStatus: "Pending",
          appointmentType: type,
        };
        const docRef = await addDoc(appointmentsRef, formValues);
        await createLogs("WALKIN", docRef.id, {
          ...formValues,
          action: "Scheduled a walkin Appointment",
        });

        return {
          message: "Successfully scheduled walkin appointment",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error in scheduling walkin appointment",
        status: "failed",
      };
    }
  };

  const finishAppointment = async (id, receiver) => {
    try {
      if (Auth.currentUser) {
        const recevingUser = await getUser(receiver);
        const appointmentDocRef = doc(firestore, "Appointments", id);
        const appointmentSnapshot = await getDoc(appointmentDocRef);

        let sessionNumber = 1;
        if (appointmentSnapshot.exists()) {
          const appointmentData = appointmentSnapshot.data();
          sessionNumber = appointmentData.sessionNumber
            ? appointmentData.sessionNumber + 1
            : 1;
        }

        const updatedAppointmentDocRef = {
          sessionNumber,
          appointmentStatus: "Finished",
          updateMessage: `This Appointment was marked finished by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
        };

        await updateDoc(appointmentDocRef, updatedAppointmentDocRef);
        await createLogs("FINISH", id, {
          ...updatedAppointmentDocRef,
          action: "Finish Counseling Appointment",
        });
        if (recevingUser) {
          await notif.storeNotifToDB(
            "Appointment",
            `Your appointment with ${Auth.currentUser.displayName} has been marked finished.`,
            receiver
          );
        }
      }
      return { message: "Succesfuly finished appointment", status: "success" };
    } catch (error) {
      return {
        message: "Error has occured in finishing appointment",
        status: "failed",
      };
    }
  };
  // { id,
  //   currentAppointment,
  //   date,
  //   duration,
  //   radio,
  //   receiver,
  //   keyissues,
  //   rootcause,
  //   recommendation,
  //   expectedOutcome,
  //   yearLevel,
  //   age}
  const makeReport = async (formValue) => {
    try {
      if (!Auth.currentUser) {
        throw new Error("User is not authenticated.");
      }
      const appointmentDocRef = doc(
        firestore,
        "Appointments",
        formValue.appointment
      );
      let reportRef;
      if (formValue.currentAppointment) {
        const followupRef = doc(
          appointmentDocRef,
          "Followup",
          formValue.currentAppointment
        );
        reportRef = collection(followupRef, "Reports");
      } else {
        reportRef = collection(appointmentDocRef, "Reports");
      }
      const querySnapshot = await getDocs(query(reportRef));
      if (!querySnapshot.empty) {
        return {
          message: "A report already exists for this document!",
          status: "failed",
        };
      }
      await addDoc(reportRef, {
        ...formValue,
        ReportBy: Auth.currentUser.uid,
        appointmentReference: formValue.appointment,
        createdAt: serverTimestamp(),
      });
      return { message: "Report made successfully!", status: "success" };
    } catch (error) {
      return {
        message: `Error in making report: ${error.message}`,
        status: "failed",
      };
    }
  };

  // appointment,
  // concernType,
  // apptDate,
  // yearLevel,
  // age,
  // sessionNumber,
  // location,
  // observation,
  // nonVerbalCues,
  // summary,
  // techniques,
  // actionPlan,
  // evaluation,
  // receiver,
  const makeGuidanceReport = async (formValue) => {
    try {
      if (Auth.currentUser) {
        const appointmentDocRef = doc(
          firestore,
          "Appointments",
          formValue.appointment
        );

        const appointmentSnapshot = await getDoc(appointmentDocRef);
        if (!appointmentSnapshot.exists()) {
          throw new Error("Appointment does not exist.");
        }

        const reportRef = collection(appointmentDocRef, "Reports");

        await addDoc(reportRef, {
          ...formValue,
          appointmentDate: formValue.apptDate,
          department: "Guidance",
          ReportBy: Auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });

        return { message: "Report successfully created!", status: "success" };
      } else {
        return { message: "User not authenticated", status: "failed" };
      }
    } catch (error) {
      return { message: "Error in making report", status: "failed" };
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

      if (Auth.currentUser) {
        const formValuesF = {
          facultyRating,
          facultyfeedback,
          createdAt: serverTimestamp(),
        };
        const docFRef = await addDoc(facultyRatingRef, formValuesF);
        const formValuesA = {
          appointmentID: aid,
          consultationRating,
          consultationfeedback,
        };
        const docARef = await addDoc(appointmentRatingRef, formValuesA);
        await createLogs("RATING", docFRef.id, {
          ...formValuesF,
          action: "Rated instructor",
        });
        await createLogs("RATING", docARef.id, {
          ...formValuesA,
          action: "Rated appointment",
        });
        return {
          message: "Successfully rated experiences",
          status: "success",
        };
      }
    } catch (error) {
      return {
        message: "Error occurred in rating expreriences",
        status: "failed",
      };
    }
  };

  //General
  const getMessages = async (receiver) => {
    try {
      if (Auth.currentUser && receiver) {
        const querySnapshot = await getDocs(
          query(
            messagesRef,
            orderBy("createAt", "desc"),
            where(
              "participants",
              "array-contains",
              Auth.currentUser.displayName
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
      if (Auth.currentUser) {
        const formValues = {
          text: formValue,
          createAt: serverTimestamp(),
          uid,
          sentBy: Auth.currentUser.displayName,
          sentTo: receiver,
          participants: [Auth.currentUser.displayName, receiver],
        };
        console.log("formvalues", formValues);
        const docRef = await addDoc(messagesRef, formValues);
        console.log("docRef", docRef);
        await createLogs("MESSAGE", docRef.id, {
          ...formValues,
          action: "Sent Message",
        });
      }
      console.log("logs");

      return {
        message: "Successfully sent message",
        status: "success",
      };
    } catch (error) {
      return {
        message: "Error occurred in sending message",
        status: "failed",
      };
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
      if (Auth.currentUser) {
        const storageRef = ref(
          storage,
          `messageAttachments/${
            Auth.currentUser.uid
          }-${generateRandomString()}-${file.name}`
        );
        await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(storageRef);
        const fileType = file.type;
        await addDoc(messagesRef, {
          file: { fileAttachment: downloadURL, fileType },
          createAt: serverTimestamp(),
          uid,
          sentBy: Auth.currentUser.displayName,
          sentTo: receiver,
          participants: [Auth.currentUser.displayName, receiver],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeUserProfile = async (imageFile) => {
    if (Auth.currentUser) {
      try {
        const storageRef = ref(
          storage,
          `profileImages/${Auth.currentUser.uid}`
        );
        await uploadBytes(storageRef, imageFile);

        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, {
          photoURL: downloadURL,
        });
        await updateDoc(doc(firestore, "Users", Auth.currentUser.uid), {
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

  const updateUserInfo = async (formValue, id) => {
    try {
      if (Auth.currentUser) {
        const usersDocRef = doc(firestore, "Users", id);
        const updatedUsersRef = {
          ...formValue,
          updatedAt: new Date().toISOString(),
        };
        await updateDoc(usersDocRef, updatedUsersRef);

        return {
          message: "Updated users information successfuly",
          status: "success",
        };
      } else {
        toast.error("User is not authenticated");
      }
    } catch (error) {
      return {
        message: `Updating users information failed `,
        status: "failed",
        errorDetails: error,
      };
    }
  };

  const subscribeToUserChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
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
  const subscribeToLogsChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
        const LogsCollectionRef = collection(firestore, "ActionLogs");
        if (user) {
          const q = query(
            LogsCollectionRef,
            where("performedBy", "==", user.uid),
            orderBy("timestamp", "desc")
          );
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            callback(data);
          });
          return unsubscribe;
        }
      }
    } catch (error) {
      console.error("Error in getting action logs");
    }
  };

  const subscribeToInstructorChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
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
  const subscribeToStudentChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
        const q = query(
          usersCollectionRef,
          where("role", "in", ["Student"]),
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedFaculty", "==", Auth.currentUser.uid),
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
  const subscribeToSwithTGAppointmentChanges = async (
    appointee,
    status,
    callback
  ) => {
    try {
      if (Auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedFaculty", "==", Auth.currentUser.uid),
            where("appointee", "==", appointee),
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

  const subscribeToFollowupAppointmentChanges = async (status, callback) => {
    try {
      if (Auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedFaculty", "==", Auth.currentUser.uid),
            where("appointmentStatus", "in", statusArray),
            where("appointmentFormat", "!=", "Walkin")
          ),
          async (snapshot) => {
            const followups = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const followupRef = collection(doc.ref, "Followup");

                const followupSnapshot = await getDocs(
                  query(
                    followupRef,
                    where("appointmentStatus", "==", "Followup")
                  )
                );

                return followupSnapshot.empty
                  ? null
                  : followupSnapshot.docs.map((followupDoc) => ({
                      id: followupDoc.id,
                      ...followupDoc.data(),
                    }));
              })
            );

            callback(followups.filter((followup) => followup !== null).flat());
          }
        );
        return unsubscribe;
      }
    } catch (error) {
      console.error(
        "Error subscribing to follow-up appointment changes:",
        error
      );
    }
  };

  const subscribeToApptFollowupChanges = async (id, callback) => {
    try {
      if (Auth.currentUser) {
        const unsubscribe = onSnapshot(
          doc(appointmentsRef, id),
          async (appointmentDoc) => {
            if (appointmentDoc.exists()) {
              const followupRef = collection(appointmentDoc.ref, "Followup");
              const followupSnapshot = await getDocs(
                query(
                  followupRef,
                  where("appointmentStatus", "in", ["Finished", "Recorded"])
                )
              );

              const followups = followupSnapshot.docs.map((followupDoc) => ({
                id: followupDoc.id,
                ...followupDoc.data(),
              }));

              callback(followups);
            } else {
              console.log("No such appointment document!");
              callback([]);
            }
          }
        );

        return unsubscribe;
      }
    } catch (error) {
      console.error(
        "Error subscribing to follow-up appointment changes:",
        error
      );
    }
  };

  const subscribeToAllAppointmentChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointedFaculty", "==", Auth.currentUser.uid)
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

  const subscribeToTodayAppointmentChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointmentFormat", "==", "Walkin"),
            where("appointmentStatus", "in", statusArray),
            where("appointedFaculty", "==", Auth.currentUser.uid)
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

  const subscribeToSCSChanges = async (format, callback) => {
    try {
      if (Auth.currentUser) {
        const formatArray = Array.isArray(format) ? format : [format];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointmentFormat", "in", formatArray),
            where("appointedFaculty", "==", Auth.currentUser.uid)
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
    if (Auth.currentUser) {
      const unsubscribe = onSnapshot(
        query(
          messagesRef,
          orderBy("createAt", "desc"),

          where(
            "participants",
            "array-contains",
            Auth.currentUser.displayName,
            Auth.currentUser.email
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
      if (Auth.currentUser) {
        const statusArray = Array.isArray(status) ? status : [status];
        const unsubscribe = onSnapshot(
          query(
            appointmentsRef,
            where("appointee", "==", Auth.currentUser.uid),
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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

  const denyRegistration = async (id, denyMessage, receiver) => {
    try {
      if (Auth.currentUser) {
        const registrationDocRef = doc(
          firestore,
          "StudentRegistrationRequest",
          id
        );
        const updatedRegistrationDocRef = {
          status: "Denied",
          updateMessage: `This Registration was denied by ${Auth.currentUser.firstName} ${Auth.currentUser.lastName}`,
        };
        await updateDoc(registrationDocRef, updatedRegistrationDocRef);
        await notif.storeNotifToDB(
          "Registration Denied",
          denyMessage,
          receiver
        );
        toastMessage("Registration Denied");
      }
    } catch (error) {
      console.log("Error has occured");
    }
  };

  const subscribetoPendingRegistration = async (callback) => {
    try {
      if (Auth.currentUser) {
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
      setNotifSent(true);
    } catch (error) {
      toastMessage("Error adding document: ", error.message);
      setNotifSent(false);
    }
  };

  const getDays = async () => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const dayRef = doc(firestore, "Schedules", day);
        const timeslotsCollectionRef = collection(dayRef, "timeslots");
        const timeslotDocRef = doc(timeslotsCollectionRef, timeslotID);
        await deleteDoc(timeslotDocRef);
      } else {
        console.log("No Authenticated user");
      }
    } catch (error) {
      console.error("Error in deleting schedule", error.message);
    }
  };

  const subscribeToSchedulesChanges = async (callback) => {
    try {
      if (Auth.currentUser) {
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

      if (Auth.currentUser) {
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
    if (Auth.currentUser) {
      try {
        const userRef = doc(firestore, "Users", id);
        const userRatingRef = collection(userRef, "FacultyRating");

        if (Auth.currentUser) {
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

  const getReports = async (id, precedingApptId = null) => {
    if (Auth.currentUser) {
      try {
        const apptRef = precedingApptId
          ? doc(
              doc(collection(firestore, "Appointments"), precedingApptId),
              "Followup",
              id
            )
          : doc(firestore, "Appointments", id);
        const reportsRef = collection(apptRef, "Reports");

        const querySnapshot = await getDocs(query(reportsRef));

        const reportData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (!reportData.length && precedingApptId) {
          console.log(
            `No reports found in preceding appointment ${precedingApptId}`
          );
          return [];
        }

        return reportData.length ? reportData : [];
      } catch (error) {
        console.error("Error fetching reports:", error.message);
        toastMessage("Error in fetching reports: ", error.message);
        return [];
      }
    }
  };

  const subscribeToRatingChanges = async (callback, id) => {
    try {
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
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
      if (Auth.currentUser) {
        const dayRef = doc(firestore, "Schedules", day.id);
        const timeslotsCollectionRef = collection(dayRef, "timeslots");
        const q = query(
          timeslotsCollectionRef,
          where("assignedInstructor.userID", "==", Auth.currentUser.uid)
        );
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
    getAppointmentReport,
    getAppointmentRecords,
    walkinAppointment,
    makeReferal,
    makeWalkin,
    uploadESignature,
    subscribeToWalkinAppointmentChanges,
    subscribeToSCSChanges,
    getAppointmentRequests,
    getInstructorAppointment,
    approveAppointment,
    markAppointmentNoShow,
    denyAppointment,
    acceptResched,
    reschedAppointment,
    denyRegistration,
    followupAppointment,
    guidanceFollowupRecord,
    walkinScheduleAppointment,
    finishAppointment,
    makeReport,
    makeGuidanceReport,
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
    getReports,
    subscribeToRatingChanges,
    // updateScheduleData,
    deleteSchedule,
    changeUserProfile,
    setInstructorSchedule,
    subscribeToTimeslotChanges,
    getAppointmentList,
    getFinishedFacultyAppointment,
    getPendingRegistrationRequests,
    updateUserInfo,
    subscribeToLogsChanges,
    subscribetoPendingRegistration,
    subscribeToAppointmentChanges,
    subscribeToSwithTGAppointmentChanges,
    subscribeToFollowupAppointmentChanges,
    subscribeToApptFollowupChanges,
    subscribeToAllAppointmentChanges,
    subscribeToUserAppointmentChanges,
    subscribeToTodayAppointmentChanges,
    subscribeToMessageChanges,
    subscribeToRequestedAppointmentChanges,
    subscribeToUserChanges,
    subscribeToInstructorChanges,
    subscribeToStudentChanges,
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
