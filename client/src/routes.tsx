import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPages/LoginPage";
const RegistrationPage = lazy(() => import("./pages/RegistrationPage/RegistrationPage"));
import { Layout } from "./components/Layout/Layout";
const DashBoardPage = lazy(() => import("./pages/DashBoardPage/DashBoardPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage/SettingsPage"));
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { CategoriesPage } from "./pages/CategoriesPage/CategoriesPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { ForgotPasswordPage } from "./pages/LoginPages/ForgotPasswordPage";
const EmailVerificationPage = lazy(() => import("./pages/VerificationPages/EmailVerificationPage"));
import { ResetPasswordPage } from "./pages/LoginPages/ResetPasswordPage";
import { withSuspense } from "./utils/utils";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: withSuspense(<RegistrationPage />) },
  { path: "/verify-email", element: withSuspense(<EmailVerificationPage />) },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(<DashBoardPage />) },
      { path: "categories", element: <CategoriesPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "settings", element: withSuspense(<SettingsPage />) },
      { path: "error", element: <ErrorPage /> },
    ],
  },
]);
