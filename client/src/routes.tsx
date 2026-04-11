import { createBrowserRouter } from "react-router";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage";
import { Layout } from "./components/Layout/Layout";
import { DashBoardPage } from "./pages/DashBoardPage/DashBoardPage";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { CategoriesPage } from "./pages/CategoriesPage/CategoriesPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";
import {TestPage} from "./pages/TestPage/TestPage";
import { AddTransaction } from "./components/AddTransaction/AddTransaction";
// import ErrorPage from '../public/error.html';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <DashBoardPage /> },
      { path: "/categories", element: <CategoriesPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
      {path: "/settings", element: <div>Settings Page</div>},
      { path: "/error", element: <ErrorPage /> },
      { path: "/test", element: <TestPage /> },
      { path: "/add", element: <AddTransaction /> }
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegistrationPage /> },
]);
