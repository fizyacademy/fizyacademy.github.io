// App.jsx

import './App.css';
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { getRole, isAuthenticated } from "./utils";
import AccountSettings from "./Pages/AccountSettings";
import UIReferencePage from './Pages/UiReferencePage';

const Student = lazy(() => import("./Pages/Student"));
const Admin = lazy(() => import("./Pages/Admin"));
const Moderator = lazy(() => import("./Pages/Moderator"));
const Landing = lazy(() => import("./Pages/Landing"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const detectRole = () => {
        const role = isAuthenticated() ? getRole().trim().toLowerCase() : "guest";
        return role;
    };

    useEffect(() => {
        const updateUserRole = () => {
            const newRole = detectRole();
            setUserRole(newRole);
            setLoading(false);
        };

        updateUserRole();
        const storageListener = () => updateUserRole();
        window.addEventListener("storage", storageListener);
        const intervalId = setInterval(updateUserRole, 1000);

        return () => {
            window.removeEventListener("storage", storageListener);
            clearInterval(intervalId);
        };
    }, []);

    if (loading || userRole === null) return <Loading />;

    const RoleComponent = {
        admin: <Admin />,
        student: <Student />,
        moderator: <Moderator />,
        guest: <Landing />
    }[userRole] || <Landing />;

    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<AccountSettings />} />
                    <Route path="/ui-reference" element={<UIReferencePage />} />
                    <Route path="/*" element={RoleComponent} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
