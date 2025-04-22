import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import DashboardAslab from "./pages/dashboardAslab";

const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" />;
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

        {/* Redirect root path */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />}
        />

        {/* Dashboard Mahasiswa (with nested routes) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/logbooks"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <Logbook />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Dashboard Aslab */}
        <Route
          path="/dashboardAslab"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Layout setIsLoggedIn={setIsLoggedIn}>
                <DashboardAslab />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
