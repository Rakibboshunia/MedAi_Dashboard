import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import PrivateRoute from "../components/PrivateRoute";

import Home from "../pages/Home";

import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyOTP from "../pages/Auth/VerifyOTP";
import PasswordChanged from "../pages/Auth/PasswordChanged";

import Users from "../pages/Users";
import Doctors from "../pages/Doctors";
import Pharmacies from "../pages/Pharmacies";
import Notifications from "../pages/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/pharmacies",
        element: <Pharmacies />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />,
  },
  {
    path: "/password-changed",
    element: <PasswordChanged />,
  },
]);

export default router;