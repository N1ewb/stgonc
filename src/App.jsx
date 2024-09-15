import React from "react";
import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import { DBProvider } from "./context/db/DBContext";
import { PrivateRoutes } from "./utils/protected-routes/routes";
import { CallProvider } from "./context/call/CallContext";
import { MessagingProvider } from "./context/notification/NotificationContext";
import { StorageProvider } from "./context/storage/StorageContext";
import { Toaster } from "react-hot-toast";

import Chatroom from "./pages/chatroom/Chatroom";
import LandingPage from "./pages/landingpage/LandingPage";
import DashboardSelector from "./pages/DashboardSelector/DashboardSelector";
import Navbar from "./components/heading/Navbar";
import VideoCall from "./pages/videocall/VideoCall";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";
import AdminRegistration from "./pages/authentication/register/admin_register/AdminRegistration";
import StudentRegister from "./pages/authentication/register/student_register/Register";
import TeacherRegister from "./pages/authentication/register/teacher_register/TeacherRegister";
import Userpage from "./pages/UsersPages/UsersProfile/Userpage";
import LoginPage from "./pages/authentication/login/Login";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import GuidanceCounselorLayout from "./layouts/GuidanceCounselorLayout/GuidanceCounselorLayout";
import FacultyLayout from "./layouts/FacultyLayout/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout/StudentLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import StudentDashboard from "./pages/UsersPages/student/dashboard/StudentDashboard";
import AdminGraphs from "./pages/UsersPages/admin/admin_pages/admin_graphs/admin_graphs";
import AdminDashboard from "./pages/UsersPages/admin/dashboard/AdminDashboard";
import AdminAppointmentListPage from "./pages/UsersPages/admin/admin_pages/admin_appointments/admin_appointments_list";
import AdmingPendingRegPage from "./pages/UsersPages/admin/admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminSchedulesPage from "./pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules";
import AdminUserList from "./pages/UsersPages/admin/admin_pages/admin_userlist/adminUserList";
import AdminRegisteruserPage from "./pages/UsersPages/admin/admin_pages/adming_register_user/admin_reg_user";
import TeacherGraphs from "./pages/UsersPages/faculty/faculty_pages/faculty-graphs/TeacherGraphs";
import TeacherAppointmentListPage from "./pages/UsersPages/faculty/faculty_pages/appointment-list-page/TeacherAppointmentListPage";
import TeacherAppointmentReqPage from "./pages/UsersPages/faculty/faculty_pages/appointment-req-page/TeacherAppointmentReqPage";
import TeacherSchedulePage from "./pages/UsersPages/faculty/faculty_pages/schedules-page/TeacherSchedulePage";
import { ChatProvider } from "./context/chatContext/ChatContext";
import { Appointmentprovider } from "./context/appointmentContext/AppointmentContext";
import AdminAppointmentReqsPage from "./pages/UsersPages/admin/admin_pages/admin_appointment_reqs/AdminAppointmentReqs";
import PendingReqMessagePage from "./pages/authentication/YourRegReqisPending/PendingReqMessagePage";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/private",
          element: <PrivateRoutes />,
          children: [
            {
              path: "/private/admin",
              element: <AdminLayout />,
              children: [
                {
                  path: "/private/admin/dashboard",
                  element: <AdminGraphs />,
                },
                {
                  path: "/private/admin/dashboard/appointments-list",
                  element: <AdminAppointmentListPage />,
                },
                {
                  path: "/private/admin/dashboard/appointments-requests",
                  element: <AdminAppointmentReqsPage />,
                },
                {
                  path: "/private/admin/dashboard/pending-registrations",
                  element: <AdmingPendingRegPage />,
                },
                {
                  path: "/private/admin/dashboard/schedules",
                  element: <AdminSchedulesPage />,
                },
                {
                  path: "/private/admin/dashboard/user-list",
                  element: <AdminUserList />,
                },
                {
                  path: "/private/admin/dashboard/register-user",
                  element: <AdminRegisteruserPage />,
                },
              ],
            },
            {
              path: "/private/guidance-counselor/dashboard",
              element: <GuidanceCounselorLayout />,
              children: [],
            },
            {
              path: "/private/faculty",
              element: <FacultyLayout />,
              children: [
                {
                  path: "/private/faculty/dashboard",
                  element: <TeacherGraphs />,
                },
                {
                  path: "/private/faculty/appointments-list",
                  element: <TeacherAppointmentListPage />,
                },
                {
                  path: "/private/faculty/appointments-request",
                  element: <TeacherAppointmentReqPage />,
                },
                {
                  path: "/private/faculty/schedules",
                  element: <TeacherSchedulePage />,
                },
              ],
            },
            {
              path: "/private/student",
              element: <StudentLayout />,
              children: [
                {
                  path: "/private/student/dashboard",
                  element: <StudentDashboard />,
                },
              ],
            },
            {
              path: "/private/VideoCall",
              element: <VideoCall />,
            },
            {
              path: "/private/SendCallReq",
              element: <SendCallReq />,
            },
            {
              path: "/private/ReceiveCallReq",
              element: <ReceiveCallReq />,
            },
            {
              path: "/private/Chatroom",
              element: <Chatroom />,
            },
            {
              path: "/private/Userpage",
              element: <Userpage />,
            },
          ],
        },
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "/auth/Login",
              element: <LoginPage />,
            },
            {
              path: "/auth/StudentRegistration",
              element: <StudentRegister />,
            },
            {
              path: "/auth/FacultyRegistration",
              element: <TeacherRegister />,
            },
            {
              path: "/auth/AdminRegister",
              element: <AdminRegistration />,
            },
            {
              path: "/auth/PendingRequestMessage",
              element: <PendingReqMessagePage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <MessagingProvider>
        <DBProvider>
          <CallProvider>
            <StorageProvider>
              <ChatProvider>
                <Appointmentprovider>
                  <div className="App h-[100%] w-full bg-white">
                    <RouterProvider router={router} />
                    <Toaster />
                  </div>
                </Appointmentprovider>
              </ChatProvider>
            </StorageProvider>
          </CallProvider>
        </DBProvider>
      </MessagingProvider>
    </AuthProvider>
  );
}

export default App;
