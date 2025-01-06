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

const LogbookPage = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [newLogbook, setNewLogbook] = useState({
    start_date: "",
    end_date: "",
    activity: "",
    pic: "",
    status: "pending",
    supporting_evidence: "",
  });
  const [currentLogbook, setCurrentLogbook] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const picOptions = ["ARN", "ABY", "TPR", "NKR", "INY", "NMM", "MGD", "MNI", "NAF"];

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchLogbooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://iflab-logbook-backend.onrender.com/logbooks/", {
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

  const handleAddLogbook = async () => {
    if (!newLogbook.start_date || !newLogbook.end_date || !newLogbook.activity || !newLogbook.pic) {
      setSnackbarMessage("Please fill all required fields!");
      setSnackbarOpen(true);
      return;
    }
    if (
      newLogbook.supporting_evidence &&
      !isValidURL(newLogbook.supporting_evidence)
    ) {
      setSnackbarMessage("Invalid Google Drive link!");
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.post("https://iflab-logbook-backend.onrender.com/logbooks/", newLogbook, {
        withCredentials: true,
      });
      setSnackbarMessage("Logbook added successfully!");
      setSnackbarOpen(true);
      setOpenAddModal(false);
      setNewLogbook({
        start_date: "",
        end_date: "",
        activity: "",
        pic: "",
        status: "pending",
        supporting_evidence: "",
      });
      fetchLogbooks();
    } catch (error) {
      console.error("Error adding logbook:", error);
      setSnackbarMessage("Failed to add logbook. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleOpenEditModal = (logbook) => {
    if (!logbook.id) {
      setSnackbarMessage("Logbook ID is missing.");
      setSnackbarOpen(true);
      return;
    }
    setCurrentLogbook(logbook);
    setOpenEditModal(true);
  };

  const handleEditLogbook = async () => {
    if (
      !currentLogbook.start_date ||
      !currentLogbook.end_date ||
      !currentLogbook.activity ||
      !currentLogbook.pic
    ) {
      setSnackbarMessage("Please fill all required fields!");
      setSnackbarOpen(true);
      return;
    }
    if (
      currentLogbook.supporting_evidence &&
      !isValidURL(currentLogbook.supporting_evidence)
    ) {
      setSnackbarMessage("Invalid Google Drive link!");
      setSnackbarOpen(true);
      return;
    }
    try {
      await axios.put(
        `https://iflab-logbook-backend.onrender.com/logbooks/${currentLogbook.id}/`,
        currentLogbook,
        { withCredentials: true }
      );
      setSnackbarMessage("Logbook updated successfully!");
      setSnackbarOpen(true);
      setOpenEditModal(false);
      setCurrentLogbook(null);
      fetchLogbooks();
    } catch (error) {
      console.error("Error updating logbook:", error);
      setSnackbarMessage("Failed to update logbook. Please try again.");
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
      await axios.delete(`https://iflab-logbook-backend.onrender.com/logbooks/${id}`, {
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

  const isValidURL = (url) => {
    const regex = /^(https:\/\/drive\.google\.com\/file\/d\/[^/]+\/view)$/;
    return regex.test(url);
  };

  const filteredLogbooks = logbooks.filter((logbook) =>
    logbook.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Logbooks
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginBottom: 3 }}
            onClick={() => setOpenAddModal(true)}
          >
            + Add
          </Button>

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
                {filteredLogbooks.length > 0 ? (
                  filteredLogbooks.map((logbook) => (
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
                      <TableCell>{logbook.status}</TableCell>
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

      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add New Logbook
          </Typography>
          <TextField
            fullWidth
            label="Start Date"
            name="start_date"
            type="date"
            value={newLogbook.start_date}
            onChange={(e) => setNewLogbook({ ...newLogbook, start_date: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            name="end_date"
            type="date"
            value={newLogbook.end_date}
            onChange={(e) => setNewLogbook({ ...newLogbook, end_date: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Activity"
            name="activity"
            value={newLogbook.activity}
            onChange={(e) => setNewLogbook({ ...newLogbook, activity: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            select
            fullWidth
            label="PIC"
            name="pic"
            value={newLogbook.pic}
            onChange={(e) => setNewLogbook({ ...newLogbook, pic: e.target.value })}
            sx={{ marginBottom: 2 }}
            helperText="Please select PIC"
          >
            {picOptions.map((pic) => (
              <MenuItem key={pic} value={pic}>
                {pic}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Supporting Evidence (Google Drive Link)"
            name="supporting_evidence"
            value={newLogbook.supporting_evidence}
            onChange={(e) => setNewLogbook({ ...newLogbook, supporting_evidence: e.target.value })}
            sx={{ marginBottom: 2 }}
            helperText="Provide a valid Google Drive link"
          />
          <Button variant="contained" color="primary" onClick={handleAddLogbook} fullWidth>
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Logbook
          </Typography>
          {currentLogbook && (
            <>
              <TextField
                fullWidth
                label="Start Date"
                name="start_date"
                type="date"
                value={currentLogbook.start_date}
                onChange={(e) =>
                  setCurrentLogbook({ ...currentLogbook, start_date: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Date"
                name="end_date"
                type="date"
                value={currentLogbook.end_date}
                onChange={(e) =>
                  setCurrentLogbook({ ...currentLogbook, end_date: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Activity"
                name="activity"
                value={currentLogbook.activity}
                onChange={(e) =>
                  setCurrentLogbook({ ...currentLogbook, activity: e.target.value })
                }
                sx={{ marginBottom: 2 }}
              />
              <TextField
                select
                fullWidth
                label="PIC"
                name="pic"
                value={currentLogbook.pic}
                onChange={(e) => setCurrentLogbook({ ...currentLogbook, pic: e.target.value })}
                sx={{ marginBottom: 2 }}
              >
                {picOptions.map((pic) => (
                  <MenuItem key={pic} value={pic}>
                    {pic}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Supporting Evidence (Google Drive Link)"
                name="supporting_evidence"
                value={currentLogbook.supporting_evidence || ""}
                onChange={(e) =>
                  setCurrentLogbook({ ...currentLogbook, supporting_evidence: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                helperText="Provide a valid Google Drive link"
              />
              <Button variant="contained" color="primary" onClick={handleEditLogbook} fullWidth>
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default LogbookPage;
