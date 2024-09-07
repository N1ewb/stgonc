import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthProvider } from "../../../context/auth/AuthContext";

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
        <div className="login-container w-full h-screen flex flex-row items-center justify-around">
          <div className="login-content-left w-[60%] md:w-full flex flex-row items-center justify-center">
            <div className="login-form-container w-[75%] md:w-[90%] flex flex-col justify-center items-center">
              <div className="login-form-container-heading w-[75%] md:w-[90%]">
                <h1>Login</h1>
                <p>Login to access your STGONC account</p>
              </div>
              <div className="spacer"></div>
              <div className="login-form flex flex-col items-center justify-center flex-wrap w-[75%] md:w-[90%] gap-3 [&_input]:w-[100%] [&_input]:rounded-[4px] [&_input]:border-[1px] [&_input]:border-solid [&_input]:border-[#740000]">
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
                <div className="login-buttons w-full flex flex-col text-center gap-3">
                  <button
                    className="w-full bg-[#740000] rounded-[4px]"
                    type="submit"
                    onClick={() => handleSignIn()}
                  >
                    {"login"}
                  </button>
                  <p>
                    Don't have an account?{" "}
                    <Link
                      to={"/StudentRegistration"}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ color: "#FF8682" }}>{"Sign up"}</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-right w-[40%] flex flex-row items-center justify-center md:hidden"></div>
        </div>
      </AuthProvider>
    </>
  );
};

export default LoginPage;
