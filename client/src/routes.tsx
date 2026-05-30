import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout/Layout";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { CategoriesPage } from "./pages/CategoriesPage/CategoriesPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import { withSuspense } from "./utils/utils";

const LoginPage = lazy(() => import("./pages/LoginPages/LoginPage"));
const RegistrationPage = lazy(() => import("./pages/RegistrationPage/RegistrationPage"));
const DashBoardPage = lazy(() => import("./pages/DashBoardPage/DashBoardPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage/SettingsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/LoginPages/ForgotPasswordPage"));
const EmailVerificationPage = lazy(() => import("./pages/VerificationPages/EmailVerificationPage"));
const ResetPasswordPage = lazy(() => import("./pages/LoginPages/ResetPasswordPage"));

export const router = createBrowserRouter([
  { path: "/login", element: withSuspense(<LoginPage />), errorElement: <ErrorPage /> },
  { path: "/register", element: withSuspense(<RegistrationPage />), errorElement: <ErrorPage /> },
  {
    path: "/verify-email",
    element: withSuspense(<EmailVerificationPage />),
    errorElement: <ErrorPage />,
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPasswordPage />),
    errorElement: <ErrorPage />,
  },
  { path: "/reset-password", element: withSuspense(<ResetPasswordPage />), errorElement: <ErrorPage /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(<DashBoardPage />), errorElement: <ErrorPage /> },
      { path: "categories", element: <CategoriesPage />, errorElement: <ErrorPage /> },
      { path: "analytics", element: <AnalyticsPage />, errorElement: <ErrorPage /> },
      { path: "settings", element: withSuspense(<SettingsPage />), errorElement: <ErrorPage /> },
      { path: "error", element: <ErrorPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <ErrorPage
        code="404"
        title="Page not found"
        message="The page you are looking for does not exist or has been moved."
      />
    ),
  },
]);
