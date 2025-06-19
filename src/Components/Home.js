import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Grid, Card, CardContent, Button } from "@mui/material";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="100%">
      {/* Welcome Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome to PDF Management
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Our system allows you to easily upload, extract, edit, and analyze data from PDF & DOCX files.
        </Typography>
      </Paper>

      {/* Feature Cards Section */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Upload & Extract PDF */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>📄 Upload PDF & Extract Tables</Typography>
              <Typography variant="body2">
                Upload PDF documents and automatically extract structured data into readable tables.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/upload")}
              >
                Upload PDF
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Editor */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>📝 Document Editor</Typography>
              <Typography variant="body2">
                Modify and format DOCX files directly in your browser with real-time editing.
              </Typography>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/editor")}
              >
                Open Editor
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </Container>

  );
};

export default HomePage;
