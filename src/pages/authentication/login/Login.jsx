import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthProvider } from "../../../context/auth/AuthContext";
import { useDB } from "../../../context/db/DBContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const auth = useAuth();
  const db = useDB();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setIsSubmitting(true);
      const res = await auth.SignIn(
        emailRef.current.value,
        passwordRef.current.value
      );
      if (res.status === 'success') {
        toast.success(res.message);
      } else if (res.status === 'failed') {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error in logging in");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.currentUser) {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          if (user) {
            const userRole = user.role;
            if (userRole) {
              navigate(`/private/${userRole}/dashboard`);
              toast.success("Logged in successfuly");
            } else {
              navigate("/");
            }
          } else {
            toast.error(
              "Login failed credentials does not exist, check password or email"
            );
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
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
              <form
                onSubmit={handleSignIn}
                className="login-form flex flex-col items-center justify-center flex-wrap w-[75%] md:w-[90%] gap-3 [&_input]:w-[100%] [&_input]:rounded-[4px] [&_input]:border-[1px] [&_input]:border-solid [&_input]:border-[#740000]"
              >
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
                    disabled={isSubmitting ? true : false}
                  >
                    {!isSubmitting ? "Login" : "Submitting"}
                  </button>
                  <div className="w-full flex justify-between">
                    {" "}
                    <p>
                      Don't have an account?{" "}
                      <Link
                        to={"/auth/StudentRegistration"}
                        style={{ textDecoration: "none" }}
                      >
                        <span style={{ color: "#FF8682" }}>{"Sign up"}</span>
                      </Link>
                    </p>
                    <p>
                      Forgot Password?{" "}
                      <Link
                        to={"/auth/Resetpassword"}
                        style={{ textDecoration: "none" }}
                      >
                        <span style={{ color: "#FF8682" }}>
                          {"Reset Password"}
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="content-right w-[40%] flex flex-row items-center justify-center md:hidden"></div>
        </div>
      </AuthProvider>
    </>
  );
};

export default LoginPage;
