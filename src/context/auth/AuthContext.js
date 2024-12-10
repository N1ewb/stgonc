import React, { useContext, useState, useEffect, createContext } from "react";
import { auth, firestore } from "../../server/firebase";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { Toast } from "react-bootstrap";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const usersCollectionRef = collection(firestore, "Users");
  const [error, setError] = useState(false);

  const toastMessage = (message) => toast(message);

  const SignIn = async (email, password) => {
    if (!currentUser) {
      try {
        return await signInWithEmailAndPassword(auth, email, password).then(
          async () => {
            const uid = auth.currentUser.uid;
            const usersDocRef = doc(usersCollectionRef, uid);

            await updateDoc(usersDocRef, {
              isOnline: true,
            });
          }
        )
        
      } catch (error) {
        return { message: "Login Failed", status: "success" };
      } 
    } else {
      return toastMessage("Already logged in");
    }
  };

  const StudentSignUpRequest = (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    studentIDnumber,
    department
  ) => {
    try {
      return setDoc(doc(collection(firestore, "StudentRegistrationRequest")), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password,
        phoneNumber,
        studentIDnumber,
        department,
        role: "Student",
        status: "Pending",
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      toastMessage(error.message);
    }
  };

  const TeacherSignUp = (email, password, firstName, lastName, phoneNumber) => {
    if (!currentUser) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });

          return setDoc(
            doc(collection(firestore, "Users"), userCredential.user.uid),
            {
              userID: userCredential.user.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              phoneNumber,
              role: "Faculty",
              isOnline: true,
              appointments: {},
              schedules: {},
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return console.log("logout first");
    }
  };

  const AdminSignUp = (email, password, firstName, lastName, phoneNumber) => {
    if (!currentUser) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
          console.log("Signed upp");

          return setDoc(
            doc(collection(firestore, "Users"), userCredential.user.uid),
            {
              userID: userCredential.user.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              phoneNumber,
              role: "Admin",
              isOnline: true,
              appointments: {},
              schedules: {},
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return console.log("logout first");
    }
  };
  const CreateGuidanceAccount = (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    guidanceIDnumber
  ) => {
    if (!currentUser) {
      return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
          console.log("Signed upp");

          return setDoc(
            doc(collection(firestore, "Users"), userCredential.user.uid),
            {
              userID: userCredential.user.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              phoneNumber,
              role: "Guidance",
              guidanceIDnumber,
              isOnline: true,
              appointments: {},
              schedules: {},
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      return console.log("logout first");
    }
  };

  const SignOut = async () => {
    const uid = auth.currentUser.uid;
    const usersDocRef = doc(usersCollectionRef, uid);
    await updateDoc(usersDocRef, {
      isOnline: false,
    });
    signOut(auth)
      .then(async () => {})
      .catch((error) => toastMessage(error.message));
  };

  const getUser = async (UID) => {
    try {
      const q = query(usersCollectionRef, where("userID", "==", UID));

      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (userDoc) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Error in retreving user, ${error.message}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreUserData = await getUser(user.uid);
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          firstName: firestoreUserData?.firstName || "",
          lastName: firestoreUserData?.lastName || "",
          role: firestoreUserData?.role || "",
          isOnline: firestoreUserData?.isOnline || false,
          department: firestoreUserData?.department || "",
          instructorColorCode:
            firestoreUserData?.instructorColorCode || "#323232",
          facultyIdnumber: firestoreUserData?.facultyIdnumber,
          studentIdnumber: firestoreUserData?.studentIdnumber,
          guidanceIdnumber: firestoreUserData?.guidanceIdnumber,
          eSignature: firestoreUserData?.eSignature,
        };

        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    SignOut,
    SignIn,
    // AdminCreateStudentAccount,
    StudentSignUpRequest,
    TeacherSignUp,
    AdminSignUp,
    CreateGuidanceAccount,
  };

  return (
    <>
      <AuthContext.Provider value={value}>
        {children}
        <Toast />
      </AuthContext.Provider>
    </>
  );
};
