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
import toast from "react-hot-toast";
import { Toast } from "react-bootstrap";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const usersCollectionRef = collection(firestore, "Users");
  const studentRegistrationRequestRef = collection(
    firestore,
    "StudentRegistrationRequest"
  );
  const toastMessage = (message) => toast(message);

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
        toastMessage(error.message);
      } finally {
        toastMessage("Logged in Successfully");
      }
    } else {
      return console.log("already logged in");
    }
  };

  const StudentSignUpRequest = (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    studentIdnumber
  ) => {
    try {
      return setDoc(doc(collection(firestore, "StudentRegistrationRequest")), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password,
        phoneNumber,
        studentIdnumber,
        role: "Student",
        status: "Pending",
      });
    } catch (error) {
      toastMessage(error.message);
    }
  };

  // const AdminCreateStudentAccount = (
  //   email,
  //   password,
  //   firstName,
  //   lastName,
  //   phoneNumber,
  //   studentIdnumber,
  //   requestID,
  //   passwordRef
  // ) => {
  //   if (currentUser) {
  //     return createUserWithEmailAndPassword(auth, email, password)
  //       .then(async (userCredential) => {
  //         const user = userCredential.user;
  //         await updateProfile(user, {
  //           displayName: `${firstName} ${lastName}`,
  //         });

  //         const docRef = doc(
  //           collection(firestore, "StudentRegistrationRequest"),
  //           requestID
  //         );

  //         await updateDoc(docRef, { status: "approved" });

  //         await setDoc(doc(collection(firestore, "Users"), user.uid), {
  //           userID: user.uid,
  //           firstName: firstName,
  //           lastName: lastName,
  //           email: email,
  //           phoneNumber,
  //           studentIdnumber,
  //           role: "Student",
  //           isOnline: false,
  //         });
  //         await signOut(auth);

  //         await signInWithEmailAndPassword(
  //           auth,
  //           auth.currentUser.email,
  //           passwordRef
  //         );
  //         toastMessage("Student Account Created Successfully");
  //       })
  //       .catch((error) => {
  //         toastMessage(error.message);
  //       });
  //   }
  // };

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
    // AdminCreateStudentAccount,
    StudentSignUpRequest,
    TeacherSignUp,
    AdminSignUp,
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
