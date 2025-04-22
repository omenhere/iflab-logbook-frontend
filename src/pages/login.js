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

  const apiUrlMap = {
    mahasiswa: process.env.REACT_APP_API_URL_MAHASISWA || "https://iflab-backend-v2.onrender.com/api/auth/login",
    aslab: process.env.REACT_APP_API_URL_ASLAB || "https://iflab-backend-v2.onrender.com/api/auth/loginAslab",
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const { role, nim, password } = credentials;

    if (!nim.trim() || !password.trim()) {
      setError("Please enter both NIM and Password.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = apiUrlMap[role];
      const response = await axios.post(apiUrl, { nim, password }, { withCredentials: true });

      if (response.data && response.data.user) {
        const { name, role: roleFromResponse } = response.data.user;
        const finalRole = roleFromResponse || role;

        localStorage.setItem("name", name);
        localStorage.setItem("role", finalRole);

        setIsLoggedIn(true);
        navigate(finalRole === "mahasiswa" ? "/dashboard" : "/dashboardAslab");
      } else {
        setError("Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
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

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      <Box component="form" sx={{ marginTop: 2 }}>
        <RadioGroup
          row
          value={credentials.role}
          onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
        >
          <FormControlLabel value="mahasiswa" control={<Radio />} label="Mahasiswa" />
          <FormControlLabel value="aslab" control={<Radio />} label="Aslab" />
        </RadioGroup>

        <TextField
          fullWidth
          label="NIM"
          margin="normal"
          value={credentials.nim}
          onChange={(e) => setCredentials({ ...credentials, nim: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
