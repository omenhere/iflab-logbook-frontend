import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Modal,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Snackbar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const AslabPage = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [currentLogbook, setCurrentLogbook] = useState(null);

  const fetchLogbooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://iflab-backend-v2.onrender.com/api/logbooksAslab", {
        withCredentials: true,
      });
      setLogbooks(response.data.data);
    } catch (error) {
      console.error("Error fetching logbooks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogbooks();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChangeStatus = async (logbook, status) => {
    try {
      const updatedLogbook = { ...logbook, status };
      await axios.put(
        `https://iflab-backend-v2.onrender.com/api/updateAslab/${logbook.id}/`,
        updatedLogbook,
        { withCredentials: true }
      );
      setSnackbarMessage(`Status updated to ${status}!`);
      setSnackbarOpen(true);
      fetchLogbooks();
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbarMessage("Failed to update status. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteLogbook = async (id) => {
    if (!id) {
      setSnackbarMessage("Logbook ID is missing.");
      setSnackbarOpen(true);
      return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this logbook?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://iflab-backend-v2.onrender.com/api/logbooks/${id}`, {
        withCredentials: true,
      });
      setSnackbarMessage("Logbook deleted successfully!");
      setSnackbarOpen(true);
      fetchLogbooks();
    } catch (error) {
      console.error("Error deleting logbook:", error);
      setSnackbarMessage("Failed to delete logbook. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ padding: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxWidth: "1000px", width: "100%" }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 3 }}
          >
            Logbooks for Aslab
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Start Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>End Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Activity</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PIC</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Supporting Evidence</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logbooks.length > 0 ? (
                  logbooks.map((logbook) => (
                    <TableRow
                      key={logbook.id}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        "&:hover": { backgroundColor: "#f1f1f1" },
                      }}
                    >
                      <TableCell>{logbook.start_date}</TableCell>
                      <TableCell>{logbook.end_date}</TableCell>
                      <TableCell>{logbook.activity}</TableCell>
                      <TableCell>{logbook.pic}</TableCell>
                      <TableCell>
                        {logbook.supporting_evidence ? (
                          <a
                            href={logbook.supporting_evidence}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", color: "blue" }}
                          >
                            View Evidence
                          </a>
                        ) : (
                          "No Evidence"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleChangeStatus(logbook, logbook.status === "pending" ? "approved" : "pending")}
                        >
                          {logbook.status === "pending" ? "Approve" : "Pending"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteLogbook(logbook.id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: "center" }}>
                      No logbooks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default AslabPage;
