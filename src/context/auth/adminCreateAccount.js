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
  department,
  requestID
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    const docRef = doc(
      collection(firestore, "StudentRegistrationRequest"),
      requestID
    );
    await updateDoc(docRef, { status: "approved" });

    await setDoc(doc(collection(firestore, "Users"), user.uid), {
      userID: user.uid,
      firstName: firstName,
      lastName: lastName,

      email: email,
      phoneNumber,
      department,
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
  department,
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
          photoUrl: user.photoURL,
          phoneNumber,
          studentIdnumber,
          department,
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
  facultyIdnumber,
  department,
  password,
  confirmPassword,
  instructorColorCode
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
          facultyIdnumber,
          department,
          instructorColorCode,
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
