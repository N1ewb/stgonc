import React, {
  useContext,
  useState,
  useEffect,
  createContext,
  Children,
} from "react";
import { auth, firestore } from "../../server/firebase";
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const usersCollectionRef = collection(firestore, "Users");

  const SignIn = async (email, password) => {
    if (!currentUser) {
      try {
        if (currentUser) {
          console.log("logged in");
        }

        return await signInWithEmailAndPassword(auth, email, password).then(
          async () => {
            const uid = auth.currentUser.uid;
            const usersDocRef = doc(usersCollectionRef, uid);
            await updateDoc(usersDocRef, {
              isOnline: true,
            });
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      return console.log("already logged in");
    }
  };

  const StudentSignUp = (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    studentIdnumber
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
              studentIdnumber,
              role: "Student",
              isOnline: true,
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

  const TeacherSignUp = (email, password, firstName, lastName, phoneNumber) => {
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
              role: "Teacher",
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
      .then(async () => {
        console.log("logged out");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    SignOut,
    SignIn,
    StudentSignUp,
    TeacherSignUp,
  };

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};
