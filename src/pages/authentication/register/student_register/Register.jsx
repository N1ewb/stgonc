import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth/AuthContext";
import { runAiTest } from "../../../../utils/gemini/gemini";
import registerpageimage from "../../../../static/images/register-page-image.png";
import "./Register.css";
import toast, { Toaster } from "react-hot-toast";
import { useDB } from "../../../../context/db/DBContext";
import { spcDepartments } from "../../../../lib/global";
import { useMessage } from "../../../../context/notification/NotificationContext";

const StudentRegister = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const studentIDnumberRef = useRef();
  const departmentRef = useRef();
  const [idImage, setIdImage] = useState(null);
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const auth = useAuth();
  const db = useDB();
  const navigate = useNavigate();
  const notif = useMessage()

  const [loading, setLoading] = useState(false);

  const toastMessage = (message) => toast(message);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentSignUp = async (e) => {
    e.preventDefault();

    if (idImage !== null) {
      if (passwordRef.current.value.length < 6) {
        toastMessage("Password should be 6 characters or longer");
      } else {
        if (passwordRef.current.value === passwordConfirmRef.current.value) {
          setLoading(true);
          try {
            const aiTestResultString = await runAiTest(idImage);
            const aiTestResult = JSON.parse(aiTestResultString);

            if (aiTestResult && aiTestResult.is_similar === true) {
              await auth.StudentSignUpRequest(
                emailRef.current.value,
                passwordRef.current.value,
                firstNameRef.current.value,
                lastNameRef.current.value,
                phoneNumberRef.current.value,
                studentIDnumberRef.current.value,
                departmentRef.current.value
              );
              const notification = await notif.storeRegistrationNotifToDB(emailRef.current.value, "mellaniegambe@gmail.com", "Registration","A student has requested to register for an account!")
              if(notification){
                toastMessage("Registration Request is sent");
                clearForm();
                
                navigate("/auth/PendingRequestMessage");
              }else {
                console.log('wa pa')
              }
            } else {
              toastMessage("Can't prove ID");
            }
          } catch (error) {
            console.log(error.message)
            toastMessage("Error during registration: " + error.message);
          } finally {
            setLoading(false);
          }
        } else {
          toastMessage("Passwords do not match");
        }
      }
    } else {
      toastMessage("Please upload an ID image");
    }
  };

  const clearForm = () => {
    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    emailRef.current.value = "";
    phoneNumberRef.current.value = "";
    studentIDnumberRef.current.value = "";
    passwordRef.current.value = "";
    passwordConfirmRef.current.value = "";
    setIdImage(null); // Clear image preview
  };

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.currentUser) {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          if (user) {
            const userRole = user.role;
            if (userRole === "Student") {
              navigate("/private/student-dashboard");
            } else if (userRole === "Teacher") {
              navigate("/private/faculty-dashboard");
            } else if (userRole === "Admin") {
              navigate("/private/admin-dashboard");
            } else {
              navigate("/");
            }
          } else {
            console.error("User not found or failed to fetch user details.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserAndRedirect();
  }, [auth.currentUser, navigate]);

  return (
    <>
      <div className="signup-container h-screen w-full flex flex-row justify-around items-center">
        <div className="content-left w-[60%] md:w-full flex flex-row items-center justify-center">
          <div className="signin-form-container w-[75%] sm:w-[90%] flex flex-col justify-center items-center">
            <div className="signin-form-container-heading w-[75%] sm:w-[90%]">
              <h1>Sign Up</h1>
              <p>
                Let’s get you all set up so you can access your personal
                account.
              </p>
            </div>
            <div className="spacer"></div>
            <div className="signin-form flex flex-col items-center justify-center flex-wrap w-[75%] sm:w-[90%] gap-3 [&_input]:w-[100%] [&_input]:rounded-[4px] [&_input]:border-[1px] [&_input]:border-solid [&_input]:border-[#740000]">
              <form onSubmit={handleStudentSignUp}>
                <div className="fullname flex flex-row w-full [&_input]:w-[40%] gap-3">
                  <input
                    ref={firstNameRef}
                    name="First-Name"
                    type="text"
                    placeholder={"First Name"}
                  />
                  <input
                    ref={lastNameRef}
                    name="Last-Name"
                    type="text"
                    placeholder={"Last Name"}
                  />
                </div>

                <div className="personal-numbers flex flex-row w-full [&_input]:w-[40%] gap-3">
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder={"Email"}
                  />
                  <input
                    ref={phoneNumberRef}
                    type="text"
                    name="phone-number"
                    placeholder="Phone Number"
                  />
                </div>
                <input
                  ref={studentIDnumberRef}
                  type="text"
                  name="id-number"
                  placeholder="Student ID Number"
                />
                <select
                  className="border-solid border-[1px] border-[#740000] rounded-[4px]"
                  ref={departmentRef}
                >
                  <option name="placeholder" value=" ">
                    Department
                  </option>
                  {spcDepartments && spcDepartments.length !== 0 ? (
                    spcDepartments.map((department, index) => (
                      <option value={department} key={index}>
                        {department}
                      </option>
                    ))
                  ) : (
                    <option value="">No Department</option>
                  )}
                </select>
                <input
                  onChange={handleFileChange}
                  type="file"
                  name="id-image"
                  placeholder="Picture of your ID"
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#74000041] file:text-[#740000] hover:file:bg-[#740000] hover:file:text-[#ffffff] file:cursor-pointer"
                />

                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  placeholder={"Password"}
                />

                <input
                  ref={passwordConfirmRef}
                  type="password"
                  name="confirm-password"
                  placeholder={"Confirm Password"}
                />
                <div className="register-sign-in-buttons w-full flex flex-col text-center gap-3">
                  <button
                    className="w-full bg-[#740000] rounded-[4px]"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                  <p>
                    <b>Already have an account?</b>{" "}
                    <Link to={"/auth/Login"} style={{ textDecoration: "none" }}>
                      <span style={{ color: "#FF8682" }}> Login</span>
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="content-right w-[40%] flex flex-row items-center justify-center md:hidden">
          <img src={registerpageimage} alt="register-page-image" height={800} />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default StudentRegister;
