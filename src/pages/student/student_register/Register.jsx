import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../../context/auth/AuthContext";
import { runAiTest } from "../../../utils/gemini/gemini";

import registerpageimage from "../../../static/images/register-page-image.png";

import "./Register.css";

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
        console.log("Password should be 6 characters or longe");
      } else {
        if (passwordRef.current.value === passwordConfirmRef.current.value) {
          try {
            const aiTestResultString = await runAiTest(idImage);
            const aiTestResult = JSON.parse(aiTestResultString);

            if (aiTestResult && aiTestResult.is_similar === true) {
              auth.StudentSignUp(
                emailRef.current.value,
                passwordRef.current.value,
                firstNameRef.current.value,
                lastNameRef.current.value,
                phoneNumberRef.current.value,
                studentIDnumberRef.current.value
              );
            } else {
              console.log("cant Prove ID");
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Password dont match");
        }
      }
    } else {
      console.log("Please enter Id image");
    }
  };

  const handleSignInWithGoogle = (e) => {
    auth.SignInWithGoogle();
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
                  <div className="or-sign-in-with">
                    <div className="or-sign-in-with-line "></div>
                    Or Sign up with
                    <div className="or-sign-in-with-line "></div>
                  </div>
                  <div
                    className="with-google"
                    onClick={() => handleSignInWithGoogle()}
                  >
                    <p>
                      <img
                        src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                        alt="Google Icon"
                        height="30px"
                      />
                    </p>
                  </div>
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
      </AuthProvider>
    </>
  );
};

export default StudentRegister;
