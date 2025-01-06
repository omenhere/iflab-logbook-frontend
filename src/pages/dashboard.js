import React, { useEffect, useState } from "react";
import { Typography,Box, CircularProgress } from "@mui/material";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    nim: "",
    name: "",
    prodi: "",
    mentor: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8080/users/profile", {
          withCredentials: true,
        });
        setUserData(response.data.user || {});
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
  sx={{
    backgroundColor: "#f9f9f9",
    borderRadius: "16px",
    boxShadow: 3,
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
    marginTop: "20px",
  }}
>
  <Typography
    variant="h5"
    gutterBottom
    sx={{ textAlign: "center", fontWeight: "bold", color: "#2c3e50" }}
  >
    Caslab
  </Typography>
  <Typography
    variant="subtitle1"
    gutterBottom
    sx={{
      padding: "8px 0",
      fontSize: "16px",
      borderBottom: "1px solid #e0e0e0",
    }}
  >
    <strong>Name:</strong> {userData.name}
  </Typography>
  <Typography
    variant="subtitle1"
    gutterBottom
    sx={{
      padding: "8px 0",
      fontSize: "16px",
      borderBottom: "1px solid #e0e0e0",
    }}
  >
    <strong>NIM:</strong> {userData.nim}
  </Typography>
  <Typography
    variant="subtitle1"
    gutterBottom
    sx={{
      padding: "8px 0",
      fontSize: "16px",
      borderBottom: "1px solid #e0e0e0",
    }}
  >
    <strong>Program Studi:</strong> {userData.prodi}
  </Typography>
  <Typography
    variant="subtitle1"
    gutterBottom
    sx={{
      padding: "8px 0",
      fontSize: "16px",
    }}
  >
    <strong>Mentor:</strong> {userData.mentor}
  </Typography>
</Box>

  );
};

export default Dashboard;
