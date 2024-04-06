import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../../../context/auth/AuthContext";
import { runAiTest } from "../../../utils/gemini/gemini";

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
        <div
          className="signup-container"
          style={{ backgroundColor: "#545763" }}
        >
          <div className="sign-up">
            <div className="content-signup left">
              <div className="spacer"></div>
              <div className="signin-form-container">
                <div className="signin-form-container-heading">
                  <div className="signin-form-container-heading-wrapper">
                    <p>{"start_for_free"}</p>
                    <h1>{"create_new_account"}</h1>
                    <p>
                      {"already_have_account"}{" "}
                      <Link to={"/Login"} style={{ textDecoration: "none" }}>
                        <span>{"login"}</span>
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="signin-form">
                  <div className="fullname">
                    <i className="fa fa-address-card-o" aria-hidden="true"></i>
                    <input
                      ref={firstNameRef}
                      name="First-Name"
                      type="text"
                      placeholder={"first_name"}
                    />
                    <i className="fa fa-address-card-o" aria-hidden="true"></i>
                    <input
                      ref={lastNameRef}
                      name="Last-Name"
                      type="text"
                      placeholder={"last_name"}
                    />
                  </div>
                  <i className="fa fa-envelope" aria-hidden="true"></i>
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

                  <i className="fa fa-lock" aria-hidden="true"></i>
                  <input
                    ref={passwordRef}
                    type="password"
                    name="password"
                    placeholder={"password"}
                  />
                  <i className="fa fa-lock" aria-hidden="true"></i>
                  <input
                    ref={passwordConfirmRef}
                    type="password"
                    name="confirm-password"
                    placeholder={"confirm_password"}
                  />
                  <div className="sign-in-buttons">
                    <button
                      type="submit"
                      className="singin-button"
                      onClick={() => handleStudentSignUp()}
                    >
                      {"signup"}
                    </button>
                    <div
                      className="with-google"
                      onClick={() => handleSignInWithGoogle()}
                    >
                      <p>
                        <img
                          src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                          alt="Google Icon"
                          height="20px"
                        />{" "}
                        <span>{"sign-in-with-google"}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content right"></div>
          </div>
        </div>
      </AuthProvider>
    </>
  );
};

export default StudentRegister;
