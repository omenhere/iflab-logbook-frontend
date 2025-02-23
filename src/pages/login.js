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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ nim: "", password: "", role: "mahasiswa" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Menentukan API endpoint berdasarkan role yang dipilih
    const apiUrl =
      credentials.role === "mahasiswa"
        ? "https://iflab-backend-v2.onrender.com/api/auth/login" // Endpoint untuk mahasiswa
        : "http://localhost:3000/api/auth/loginAslab"; // Endpoint untuk aslab

    try {
      const response = await axios.post(apiUrl, credentials, {
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        const { name } = response.data.user;

        // Simpan data user dan role ke localStorage
        localStorage.setItem("name", name);
        localStorage.setItem("role", credentials.role);

        setIsLoggedIn(true);

        // Arahkan pengguna ke halaman dashboard sesuai role yang dipilih
        navigate(credentials.role === "mahasiswa" ? "/dashboard" : "/aslab-dashboard");
      } else {
        throw new Error("Invalid login credentials");
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
          onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
        >
          <FormControlLabel value="caslab" control={<Radio />} label="Caslab" />
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
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
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
