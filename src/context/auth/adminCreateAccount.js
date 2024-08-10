import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { firebaseConfig } from "../../server/firebase";

export const AdminCreateStudentAccount = async (
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  studentIdnumber,
  requestID
) => {
  // Initialize a separate Firebase app instance
  const secondaryApp = initializeApp(firebaseConfig, "secondary");
  const secondaryAuth = getAuth(secondaryApp);
  const db = getFirestore(secondaryApp);

  const toastMessage = (message) => toast(message);
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
    const docRef = doc(collection(db, "StudentRegistrationRequest"), requestID);
    await updateDoc(docRef, { status: "approved" });

    // Create user document
    await setDoc(doc(collection(db, "Users"), user.uid), {
      userID: user.uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber,
      studentIdnumber,
      role: "Student",
      isOnline: false,
    });

    await signOut(secondaryAuth);

    toastMessage("Student Account Created Successfully");
  } catch (error) {
    toastMessage(error.message);
  }
};
