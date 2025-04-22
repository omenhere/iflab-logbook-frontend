import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import LayoutAslab from "./components/layoutAslab";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import DashboardAslab from "./pages/dashboardAslab";

// 🔐 Route protection + role check
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
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Redirect root */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              localStorage.getItem("role") === "aslab"
                ? <Navigate to="/dashboardAslab" />
                : <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Mahasiswa layout */}
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

        {/* Aslab layout with Outlet */}
        <Route
          path="/dashboardAslab"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["aslab"]}>
              <LayoutAslab>
                <Outlet />
              </LayoutAslab>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardAslab />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
