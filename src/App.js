import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard";
import Logbook from "./pages/logbook";
import Login from "./pages/login";
import AslabPage from "./pages/aslabPage"; // Ensure this component is created

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
              <Navigate to={localStorage.getItem("role") === "aslab" ? "/aslab-page" : "/dashboard"} />
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

        {/* Aslab page route */}
        <Route
          path="/aslab-page"
          element={<AslabPage />}  // Add this route for Aslab role
        />
      </Routes>
    </Router>
  );
}

export default App;
