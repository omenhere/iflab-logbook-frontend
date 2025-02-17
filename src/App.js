import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import AslabPage from "./pages/aslabPage";  // Assuming you have a page for Aslab

const ProtectedRoute = ({ element: Component, isLoggedIn, role }) => {
  if (!isLoggedIn) return <Navigate to="/login" />;
  
  if (role === "aslab") {
    return <Navigate to="/aslab-page" />;
  }

  return Component;  // Show the component if user is logged in and role is not "aslab"
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("name");
    const role = localStorage.getItem("role");  // Get the user's role
    setIsLoggedIn(!!name);
    setRole(role);  // Set the role to state
  }, []);

  return (
    <Router>
      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={role === "aslab" ? "/aslab-page" : "/dashboard"} />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
            )
          }
        />

        {/* Redirect root path */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? (role === "aslab" ? "/aslab-page" : "/dashboard") : "/login"} />}
        />

        {/* Aslab Page Route */}
        <Route
          path="/aslab-page"
          element={<ProtectedRoute element={<AslabPage />} isLoggedIn={isLoggedIn} role={role} />}
        />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Layout setIsLoggedIn={setIsLoggedIn} />} isLoggedIn={isLoggedIn} role={role} />}
        >
          <Route index element={<Dashboard />} />
          <Route path="logbooks" element={<Logbook />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
