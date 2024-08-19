import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { firebaseConfig, firestore } from "../../server/firebase";

const secondaryApp = initializeApp(firebaseConfig, "secondary");
const secondaryAuth = getAuth(secondaryApp);

const toastMessage = (message) => toast(message);

export const AdminAccepptStudentAccount = async (
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  studentIdnumber,
  requestID
) => {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // Update StudentRegistrationRequest
    const docRef = doc(
      collection(firestore, "StudentRegistrationRequest"),
      requestID
    );
    await updateDoc(docRef, { status: "approved" });

    // Create user document
    await setDoc(doc(collection(firestore, "Users"), user.uid), {
      userID: user.uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber,
      studentIdnumber,
      role: "Student",
      isOnline: false,
      createdAt: Timestamp.now(),
    });

    await signOut(secondaryAuth);

    toastMessage("Student Account Created Successfully");
  } catch (error) {
    toastMessage(error.message);
  }
};

export const AdminCreateStudentAccount = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  studentIdnumber,
  password,
  confirmPassword
) => {
  try {
    if (password.length > 6) {
      if (password === confirmPassword) {
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        await setDoc(doc(collection(firestore, "Users"), user.uid), {
          userID: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber,
          studentIdnumber,
          role: "Student",
          isOnline: false,
          createdAt: Timestamp.now(),
        });

        await signOut(secondaryAuth);

        toastMessage("Student Account Created Successfully");
      } else {
        toastMessage("Password does not match");
      }
    } else {
      toastMessage("Password should at least be 7 characters long");
    }
  } catch (error) {
    toastMessage(error.message);
  }
};

export const AdminCreateFacultyAccount = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  studentIdnumber,
  password,
  confirmPassword
) => {
  try {
    if (password.length > 6) {
      if (password === confirmPassword) {
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });

        await setDoc(doc(collection(firestore, "Users"), user.uid), {
          userID: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber,
          studentIdnumber,
          role: "Teacher",
          isOnline: false,
          createdAt: Timestamp.now(),
        });

        await signOut(secondaryAuth);

        toastMessage("Faculty Account Created Successfully");
      } else {
        toastMessage("Password does not match");
      }
    } else {
      toastMessage("Password should at least be 7 characters long");
    }
  } catch (error) {
    toastMessage(error.message);
  }
};
