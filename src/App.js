import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import DashboardAslab from "./pages/dashboardAslab";

// ✅ DITAMBAHKAN DI SINI - ProtectedRoute dengan role check
const ProtectedRoute = ({ isLoggedIn, allowedRoles, children }) => {
  const userRole = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />; // atau bisa redirect ke /unauthorized
  }

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
        {/* Login */}
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

        {/* Root */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        {/* Mahasiswa */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["mahasiswa"]}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/logbooks"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["mahasiswa"]}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <Logbook />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Aslab */}
        <Route
          path="/dashboardAslab"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} allowedRoles={["aslab"]}>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
