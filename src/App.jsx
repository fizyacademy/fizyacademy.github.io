// App.jsx

import './App.css';
import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { getRole, isAuthenticated, initUserData } from "./utils";
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

    useEffect(() => {
        const loadUser = async () => {
            try {
                await initUserData();
            } catch (err) {
                console.error("❌ Error loading user data:", err.message);
            }

            const role = isAuthenticated() ? getRole().trim().toLowerCase() : "guest";
            setUserRole(role);
            setLoading(false);
        };

        loadUser();

        const storageListener = () => {
            const updatedRole = isAuthenticated() ? getRole().trim().toLowerCase() : "guest";
            setUserRole(updatedRole);
        };

        window.addEventListener("storage", storageListener);
        return () => {
            window.removeEventListener("storage", storageListener);
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
