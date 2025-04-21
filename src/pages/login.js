import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ nim: "", password: "", role: "mahasiswa" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // URL API disesuaikan dengan role
  const apiUrlMap = {
    mahasiswa: process.env.REACT_APP_API_URL_MAHASISWA || "https://iflab-backend-v2.onrender.com/api/auth/login", // URL untuk mahasiswa
    aslab: process.env.REACT_APP_API_URL_ASLAB || "https://iflab-backend-v2.onrender.com/api/auth/loginAslab", // URL untuk aslab
  };

  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset error message

    const { role, nim, password } = credentials;

    if (!nim || !password) {
      setError("Please enter both NIM and Password.");
      setLoading(false);
      return;
    }

    // Cek URL yang akan dipakai
    console.log("API URL:", apiUrlMap[role]); // Cek apakah URL yang dipilih sudah sesuai

    const apiUrl = apiUrlMap[role]; // Pilih API berdasarkan role yang dipilih

    try {
      const response = await axios.post(apiUrl, { nim, password }, { withCredentials: true });

      localStorage.setItem("lastLoginApi", apiUrl); // simpan di Login.jsx

      if (apiUrl.includes("loginAslab")) {
        navigate("/dashboardAslab"); // Redirect ke dashboard aslab
      } else {
        navigate("/dashboard");
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
        {/* Pilihan role */}
        <RadioGroup
          row
          value={credentials.role}
          onChange={(e) => {
            setCredentials({ ...credentials, role: e.target.value });
            console.log("Role changed to:", e.target.value); // Cek apakah role berubah dengan benar
          }}
        >
          <FormControlLabel value="mahasiswa" control={<Radio />} label="Mahasiswa" />
          <FormControlLabel value="aslab" control={<Radio />} label="Aslab" />
        </RadioGroup>

        {/* Input NIM */}
        <TextField
          fullWidth
          label="NIM"
          placeholder="Enter your NIM"
          margin="normal"
          value={credentials.nim}
          onChange={(e) => setCredentials({ ...credentials, nim: e.target.value })}
          required
        />

        {/* Input Password */}
        <TextField
          fullWidth
          label="Password"
          type="password"
          placeholder="Enter your password"
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />

        {/* Tombol Login */}
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
