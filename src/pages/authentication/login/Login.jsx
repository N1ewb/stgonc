import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthProvider } from "../../../context/auth/AuthContext";
import { useDB } from "../../../context/db/DBContext";

const LoginPage = () => {
  const auth = useAuth();
  const db = useDB();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSignIn = () => {
    auth.SignIn(emailRef.current.value, passwordRef.current.value);
  };

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.currentUser) {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          if (user) {
            const userRole = user.role;
            console.log(userRole);
            if (userRole === "Student") {
              navigate("/private/student/dashboard");
            } else if (userRole === "Teacher") {
              navigate("/private/faculty/dashboard");
            } else if (userRole === "Admin") {
              navigate("/private/admin/dashboard");
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
                      to={"/auth/StudentRegistration"}
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
