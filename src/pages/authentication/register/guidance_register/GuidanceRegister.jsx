import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/auth/AuthContext";

const GuidanceRegister = () => {
  const toastMessage = (message) => toastMessage(message);
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const phoneNumberRef = useRef();
  const guidanceIDnumberRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleCreateGuidnaceAccountSignUp = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const firstname = firstNameRef.current.value;
    const lastname = lastNameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;
    const idnumber = guidanceIDnumberRef.current.value;
    if (
      !email &&
      !password &&
      !firstname &&
      !lastname &&
      !phoneNumber &&
      !idnumber
    ) {
      toastMessage("Please fill in fields");
    }
    if (passwordRef.current.value.length < 6) {
      console.log("Password should be 6 characters or long");
    } else {
      if (passwordRef.current.value === passwordConfirmRef.current.value) {
        try {
          auth.CreateGuidanceAccount(
            emailRef.current.value,
            passwordRef.current.value,
            firstNameRef.current.value,
            lastNameRef.current.value,
            phoneNumberRef.current.value,
            guidanceIDnumberRef.current.value
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Password dont match");
      }
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/private/Guidance/dashboard");
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
                  <p>CreateGuidnaceAccount Registration Page</p>
                  <h1>{"create_new_account"}</h1>
                  <p>
                    {"already_have_account"}{" "}
                    <Link to={"/auth/Login"} style={{ textDecoration: "none" }}>
                      <span>{"login"}</span>
                    </Link>
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleCreateGuidnaceAccountSignUp}
                className="signin-form"
              >
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
                  type="tel"
                  name="phone-number"
                  placeholder="Phone Number"
                  maxLength={11}
                />
                <input
                  ref={guidanceIDnumberRef}
                  type="text"
                  name="guidance-counselor-idnumber"
                  placeholder="Guidance Counselor ID NUmber"
                />
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  placeholder={"password"}
                  minLength={7}
                />
                <i className="fa fa-lock" aria-hidden="true"></i>
                <input
                  ref={passwordConfirmRef}
                  type="password"
                  name="confirm-password"
                  placeholder={"confirm_password"}
                  minLength={7}
                />
                <div className="sign-in-buttons">
                  <button type="submit" className="singin-button">
                   Signup
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="content right"></div>
        </div>
      </div>
    </>
  );
};

export default GuidanceRegister;
