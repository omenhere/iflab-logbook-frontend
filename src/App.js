import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import DashboardAslab from "./pages/dashboardAslab";


const ProtectedRoute = ({ element: Component, isLoggedIn }) => {
  return isLoggedIn ? Component : <Navigate to="/login" />;
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
              <Navigate to="/dashboard" />
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

        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Layout setIsLoggedIn={setIsLoggedIn} />} isLoggedIn={isLoggedIn} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="logbooks" element={<Logbook />} />
        </Route>

        <Route
          path="/dashboardAslab"
          element={<ProtectedRoute element={<DashboardAslab />} isLoggedIn={isLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
