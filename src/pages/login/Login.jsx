import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthProvider } from "../../context/auth/AuthContext";

const LoginPage = () => {
  const auth = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSignIn = () => {
    auth.SignIn(emailRef.current.value, passwordRef.current.value);
  };

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/dashboard");
    }
  }, [auth.currentUser, navigate]);

  return (
    <>
      <AuthProvider>
        <div className="login-container">
          <div className="login-content-left">
            <div className="login-form-container">
              <div className="login-form-container-heading">
                <h1>Login</h1>
                <p>Login to access your STGONC account</p>
              </div>
              <div className="spacer"></div>
              <div className="login-form">
                <input
                  ref={emailRef}
                  type="email"
                  name="email"
                  placeholder={"email"}
                />

                <input
                  ref={passwordRef}
                  type="password"
                  name="password"
                  placeholder={"password"}
                />
                <div className="login-buttons">
                  <button type="submit" onClick={() => handleSignIn()}>
                    {"login"}
                  </button>
                  <p>
                    Don't have an account?{" "}
                    <Link
                      to={"/StudentRegister"}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#FF8682" }}>{"Sign up"}</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-right"></div>
        </div>
      </AuthProvider>
    </>
  );
};

export default LoginPage;
