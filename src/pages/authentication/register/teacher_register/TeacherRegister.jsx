import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./TeacherRegister.css";
import { useAuth } from "../../../../context/auth/AuthContext";

const TeacherRegister = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const auth = useAuth;
  const navigate = useNavigate();
  // const passwordError = () => toast('Password dont match')
  // const passwordCharsError = () => toast('Password should be 6 characters or longer')

  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setIdImage(reader.result); // Set base64 string
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };

  const handleTeacherSignUp = async (e) => {
    if (passwordRef.current.value.length < 6) {
      console.log("Password should be 6 characters or long");
    } else {
      if (passwordRef.current.value === passwordConfirmRef.current.value) {
        try {
          auth.TeacherSignUp(
            emailRef.current.value,
            passwordRef.current.value,
            firstNameRef.current.value,
            lastNameRef.current.value,
            phoneNumberRef.current.value
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Password dont match");
      }
    }
  };

  //   const handleSignInWithGoogle = (e) => {
  //     auth.SignInWithGoogle();
  //   };
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/Dashboard");
    }
  }, [auth.currentUser, navigate]);
  return (
    <>
      <div className="signup-container" style={{ backgroundColor: "#545763" }}>
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
                    <Link to={"/auth/Login"} style={{ textDecoration: "none" }}>
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
                    onClick={() => handleTeacherSignUp()}
                  >
                    {"signup"}
                  </button>
                 
                </div>
              </div>
            </div>
          </div>
          <div className="content right"></div>
        </div>
      </div>
    </>
  );
};

export default TeacherRegister;
