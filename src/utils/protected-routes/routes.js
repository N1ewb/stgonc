import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";

export const PrivateRoutes = () => {
  const auth = useAuth();
  return auth.currentUser ? <Outlet /> : <Navigate to="/auth/Login" />;
};

// export const StudentRoute = () => {
//   const auth = useAuth();
//   return auth.currentUser && auth.currentUser.role !== "student" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/" />
//   );
// };

// export const TeacherRoute = () => {
//   const auth = useAuth();
//   return auth.currentUser && auth.currentUser.role !== "teacher" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/" />
//   );
// };
