import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import { DBProvider } from "./context/db/DBContext";
import { PrivateRoutes } from "./utils/protected-routes/routes";
import { CallProvider } from "./context/call/CallContext";
import { MessagingProvider } from "./context/notification/NotificationContext";
import { StorageProvider } from "./context/storage/StorageContext";
import { Toaster } from "react-hot-toast";

import Chatroom from "./pages/chatroom/Chatroom";
import LandingPage from "./pages/landingpage/LandingPage";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/heading/Navbar";
import VideoCall from "./pages/videocall/VideoCall";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";
import AdminRegistration from "./pages/authentication/register/admin_register/AdminRegistration";
import StudentRegister from "./pages/authentication/register/student_register/Register";
import TeacherRegister from "./pages/authentication/register/teacher_register/TeacherRegister";
import Userpage from "./pages/UsersPages/UsersProfile/Userpage";
import LoginPage from "./pages/authentication/login/Login";

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <CallProvider>
          <MessagingProvider>
            <StorageProvider>
              <div className="App h-[100%] w-full bg-white">
                <BrowserRouter>
                  <Navbar />
                  <Routes>
                    <Route path="/" exact element={<LandingPage />} />
                    <Route element={<PrivateRoutes />}>
                      <Route path="/VideoCall" element={<VideoCall />} />
                      <Route path="/SendCallReq" element={<SendCallReq />} />
                      <Route
                        path="/ReceiveCallReq"
                        element={<ReceiveCallReq />}
                      />
                      <Route path="/Chatroom" element={<Chatroom />} />
                      <Route path="/Userpage" element={<Userpage />} />
                      <Route path="/Dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="/Login" element={<LoginPage />} />
                    <Route
                      path="/StudentRegistration"
                      element={<StudentRegister />}
                    />
                    <Route
                      path="/FacultyRegistration"
                      element={<TeacherRegister />}
                    />
                    <Route
                      path="/AdminRegister"
                      element={<AdminRegistration />}
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </BrowserRouter>
                <Toaster />
              </div>
            </StorageProvider>
          </MessagingProvider>
        </CallProvider>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
