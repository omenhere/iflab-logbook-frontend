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
} from "@mui/material";

const LogbookPage = () => {
  const [logbooks, setLogbooks] = useState([]); // State untuk menyimpan logbooks
  const [loading, setLoading] = useState(false); // State untuk status loading
  const [openModal, setOpenModal] = useState(false); // State untuk modal tambah data
  const [newLogbook, setNewLogbook] = useState({
    start_date: "",
    end_date: "",
    activity: "",
    pic: "",
    status: "pending", // Status default
  }); // State untuk form tambah data

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://iflab-logbook-backend.onrender.com/logbooks/", {
          withCredentials: true,
        });

        const logbooksData = response.data.data;
        setLogbooks(logbooksData);
      } catch (error) {
        console.error("Error fetching logbooks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogbooks();
  }, []);

  const handleAddLogbook = async () => {
    try {
      await axios.post(
        "https://iflab-logbook-backend.onrender.com/logbooks/",
        newLogbook,
        { withCredentials: true }
      );
      alert("Logbook added successfully!");
      setOpenModal(false);
      setNewLogbook({
        start_date: "",
        end_date: "",
        activity: "",
        pic: "",
        status: "pending", // Reset ke default
      });
      const response = await axios.get("https://iflab-logbook-backend.onrender.com/logbooks/", {
        withCredentials: true,
      });
      setLogbooks(response.data.data);
    } catch (error) {
      console.error("Error adding logbook:", error);
      alert("Failed to add logbook. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 2, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ maxWidth: "800px", width: "100%" }}>
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
            onClick={() => setOpenModal(true)}
          >
            + Tambah
          </Button>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2c3e50" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Start Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>End Date</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Activity</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>PIC</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logbooks.length > 0 ? (
                  logbooks.map((logbook, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        "&:hover": { backgroundColor: "#f1f1f1" },
                      }}
                    >
                      <TableCell>{logbook.start_date}</TableCell>
                      <TableCell>{logbook.end_date}</TableCell>
                      <TableCell>{logbook.activity}</TableCell>
                      <TableCell>{logbook.pic}</TableCell>
                      <TableCell>{logbook.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                      No logbooks found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Modal Tambah Data */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
            Tambah Data Logbook
          </Typography>
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            value={newLogbook.start_date}
            onChange={(e) => setNewLogbook({ ...newLogbook, start_date: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            value={newLogbook.end_date}
            onChange={(e) => setNewLogbook({ ...newLogbook, end_date: e.target.value })}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Activity"
            value={newLogbook.activity}
            onChange={(e) => setNewLogbook({ ...newLogbook, activity: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="PIC"
            value={newLogbook.pic}
            onChange={(e) => setNewLogbook({ ...newLogbook, pic: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleAddLogbook} fullWidth>
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default LogbookPage;
