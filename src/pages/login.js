import React, { useState } from "react";
import { login } from "../services/api"; // Import fungsi login
import axios from "axios"; // Untuk memanggil API getUser
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
      // Kirim data login ke backend
      await login(credentials);

      // Ambil data pengguna dari endpoint /users/profile
      const response = await axios.get("http://localhost:8080/users/profile", {
        withCredentials: true, // Kirim cookie dengan permintaan
      });

      const { name } = response.data.user;
      localStorage.setItem("name", name); // Simpan data pengguna di localStorage

      setIsLoggedIn(true); // Perbarui state isLoggedIn
      navigate("/dashboard"); // Redirect ke dashboard
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials.");
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
