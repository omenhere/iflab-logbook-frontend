import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import LayoutAslab from "./components/layoutAslab";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import DashboardAslab from "./pages/dashboardAslab";
import { Outlet } from "react-router-dom";

// 🔐 Middleware route dengan cek role
const ProtectedRoute = ({ isLoggedIn, allowedRoles, children }) => {
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/login" />;

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("name");
    setIsLoggedIn(!!name);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              localStorage.getItem("role") === "aslab"
                ? <Navigate to="/dashboardAslab" />
                : <Navigate to="/dashboard" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        {/* Mahasiswa Layout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["mahasiswa"]}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <Outlet />
              </Layout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="logbooks" element={<Logbook />} />
        </Route>

        {/* Aslab Layout */}
        <Route
          path="/dashboardAslab"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["aslab"]}>
              <LayoutAslab>
                <DashboardAslab />
              </LayoutAslab>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
