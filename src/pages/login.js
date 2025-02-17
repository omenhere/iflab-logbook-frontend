import React, { useState } from "react";
import axios from "axios"; // Untuk memanggil API
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ nim: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://iflab-backend-v2.onrender.com/api/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      );
      
      if (response.data && response.data.user) {
        const { name, role } = response.data.user; // Extract role along with name
      
        localStorage.setItem("name", name);
        localStorage.setItem("role", role); // Menyimpan role pengguna

        console.log(localStorage.getItem("role"));
      
        setIsLoggedIn(true);
      
        // Navigate to the appropriate page based on the role
        if (role === "aslab") {
          navigate("/aslab-page");  // Navigate to the Aslab page if the role is aslab
        } else {
          navigate("/dashboard");  // Otherwise, navigate to the dashboard
        }
      } else {
        // Handle the case where user data is not available
        console.error("Login failed or user data is missing.");
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        marginTop: "10%",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        SiCaslab
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        Please log in to continue
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Box component="form" sx={{ marginTop: 2 }}>
        <TextField
          fullWidth
          label="NIM"
          placeholder="Enter your NIM"
          margin="normal"
          value={credentials.nim}
          onChange={(e) => setCredentials({ ...credentials, nim: e.target.value })}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          placeholder="Enter your password"
          margin="normal"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Login"}
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
