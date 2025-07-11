// App.jsx
import './App.css';
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Loading from "./components/Loading";
import { AuthProvider, useAuth } from "./AuthContext";
import AccountSettings from "./Pages/AccountSettings";
import UIReferencePage from './Pages/UiReferencePage';

const Student = lazy(() => import("./Pages/Student"));
const Admin = lazy(() => import("./Pages/Admin"));
const Moderator = lazy(() => import("./Pages/Moderator"));
const Landing = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  const role = user?.role || "guest";

  const RoleComponent = {
    admin: <Admin />,
    student: <Student />,
    moderator: <Moderator />,
    guest: <Landing />
  }[role] || <Landing />;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/ui-reference" element={<UIReferencePage />} />
        <Route path="/*" element={RoleComponent} />
      </Routes>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontSize: "0.95rem",
            direction: "rtl",
            borderRadius: "8px",
          },
          duration: 4000,
        }}
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;
