import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from "@mui/material";

const PDFUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      setError("Invalid file type. Please upload a PDF.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.tables || response.data.tables.length === 0) {
        throw new Error("No valid tables found in the PDF.");
      }

      console.log("Extracted Data:", response.data.tables);
      setData(response.data.tables || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error processing the PDF.");
    }

    setLoading(false);
  };

  return (
    <>
    <Container maxWidth="lg">

      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Upload PDF to Extract Tables
        </Typography>

        <Box
          sx={{
            border: "2px dashed gray",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            marginBottom: "20px",
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <Typography variant="body1">Drag & Drop your PDF here</Typography>
        </Box>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap={2} sx={{ mb: 3 }}>
          <Button variant="contained" component="label" startIcon={<FaFileUpload />}>
            Choose File
            <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
          </Button>
          <Typography>{file ? file.name : "No file selected"}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Upload"}
          </Button>
        </Box>

        {error && <Typography color="error" align="center">{error}</Typography>}

        {data.length > 0 && (
          <Box mt={4}>
            {data.map((table, index) => (
              Array.isArray(table) && table.length > 0 ? (
                <Paper key={index} sx={{ mb: 4, p: 3 }} elevation={2}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Table {index + 1}</Typography>
                  <TableContainer>
                    <Table>
                      {Array.isArray(table[0]) && table[0].every(cell => typeof cell === "string") && (
                        <TableHead>
                          <TableRow>
                            {table[0].map((header, i) => (
                              <TableCell key={i} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                      )}
                      <TableBody>
                        {table.slice(1).map((row, rowIndex) => (
                          Array.isArray(row) && row.length > 0 ? (
                            <TableRow key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex}>{cell || "-"}</TableCell>
                              ))}
                            </TableRow>
                          ) : null
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ) : null
            ))}
          </Box>
        )}
      </Paper>
    </Container>
    </>
  );
};

export default PDFUpload;
