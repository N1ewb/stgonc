import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../../context/auth/AuthContext";
import { runAiTest } from "../../../utils/gemini/gemini";

import registerpageimage from "../../../static/images/register-page-image.png";

import "./Register.css";
import toast, { Toaster } from "react-hot-toast";

const StudentRegister = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const studentIDnumberRef = useRef();
  const [idImage, setIdImage] = useState(null);
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const auth = useAuth();
  const navigate = useNavigate();

  const toastMessage = (message) => toast(message);

  // const passwordError = () => toast('Password dont match')
  // const passwordCharsError = () => toast('Password should be 6 characters or longer')

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImage(reader.result); // Set base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentSignUp = async (e) => {
    if (idImage !== null) {
      console.log(typeof idImage);
      if (passwordRef.current.value.length < 6) {
        toastMessage("Password should be 6 characters or longer");
      } else {
        if (passwordRef.current.value === passwordConfirmRef.current.value) {
          try {
            const aiTestResultString = await runAiTest(idImage);
            const aiTestResult = JSON.parse(aiTestResultString);

            if (aiTestResult && aiTestResult.is_similar === true) {
              auth.StudentSignUpRequest(
                emailRef.current.value,
                passwordRef.current.value,
                firstNameRef.current.value,
                lastNameRef.current.value,
                phoneNumberRef.current.value,
                studentIDnumberRef.current.value
              );
            } else {
              toastMessage("cant Prove ID");
            }
          } catch (error) {
            toastMessage(error);
          }
        } else {
          toastMessage("Password dont match");
        }
      }
    } else {
      toastMessage("Please enter Id image");
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/Dashboard");
    }
  }, [auth.currentUser, navigate]);
  return (
    <>
      <AuthProvider>
        <div className="signup-container">
          <div className="content-left">
            <div className="signin-form-container">
              <div className="signin-form-container-heading">
                <h1>Sign Up</h1>
                <p>
                  Let’s get you all st up so you can access your personal
                  account.
                </p>
              </div>
              <div className="spacer"></div>
              <div className="signin-form">
                <div className="fullname">
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

                <div className="personal-numbers">
                  <input
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder={"email"}
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
                <input
                  onChange={handleFileChange}
                  type="file"
                  name="id-image"
                  placeholder="Picture of your ID"
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
                <div className="register-sign-in-buttons">
                  <button type="submit" onClick={() => handleStudentSignUp()}>
                    Create account
                  </button>
                  <p>
                    <b>Already have an account?</b>{" "}
                    <Link to={"/Login"} style={{ textDecoration: "none" }}>
                      <span style={{ color: "#FF8682" }}> Login</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-right">
            <img
              src={registerpageimage}
              alt="register-page-image"
              height={800}
            />
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </>
  );
};

export default StudentRegister;
