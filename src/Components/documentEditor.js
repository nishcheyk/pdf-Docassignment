import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import Mammoth from "mammoth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import htmlDocx from "html-docx-js/dist/html-docx";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Typography,
  TextField,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Tinymce from "./tinymce";
import beautify from "js-beautify";

const DocumentEditor = () => {
  const [documentText, setDocumentText] = useState("");
  const [editorMode, setEditorMode] = useState("basic"); // Modes: "basic", "html", "advanced"
  const [loading, setLoading] = useState(false); // <- loading state

  const formatHtml = (html) => {
    return beautify.html(html, { indent_size: 2, wrap_line_length: 0 });
  };

  const handleFileUpload = useCallback(async (file) => {
    if (!file || !file.name.endsWith(".docx")) {
      alert("Please upload a valid .docx file!");
      return;
    }

    try {
      setLoading(true); // Start loader
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;

        try {
          const result = await Mammoth.convertToHtml({ arrayBuffer });
          setDocumentText(formatHtml(result.value));
        } catch (error) {
          console.error("Error converting file:", error);
          alert("Failed to process the document.");
        } finally {
          setLoading(false); // Stop loader
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File reading error:", error);
      setLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".docx",
    multiple: false,
  });

  const saveEditedDocx = () => {
    const htmlContent = `<html><body>${documentText}</body></html>`;
    const converted = htmlDocx.asBlob(htmlContent);
    saveAs(converted, "edited-document.docx");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "auto",
        maxHeight: "100%",
        overflowY: "auto",
        padding: "20px",
        gap: "20px",
      }}
    >
      {/* Loader Overlay */}
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Typography>Choose Editor Mode:</Typography>
        <Button
          variant={editorMode === "basic" ? "contained" : "outlined"}
          onClick={() => setEditorMode("basic")}
          disabled={loading}
        >
          BASIC
        </Button>
        <Button
          variant={editorMode === "html" ? "contained" : "outlined"}
          onClick={() => setEditorMode("html")}
          disabled={loading}
        >
          HTML
        </Button>
        <Button
          variant={editorMode === "advanced" ? "contained" : "outlined"}
          onClick={() => setEditorMode("advanced")}
          disabled={loading}
        >
          Advanced
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: 3,
          height: "auto",
          maxHeight: "600px",
        }}
      >
        <CardContent>
          <Typography variant="h6">Upload and Edit Document</Typography>
          <Divider />
          <Box
            {...getRootProps()}
            sx={{
              marginTop: "10px",
              padding: "20px",
              border: "2px dashed #aaa",
              borderRadius: "10px",
              textAlign: "center",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <input {...getInputProps()} disabled={loading} />
            <Typography>
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop a .docx file here, or click to select one"}
            </Typography>
          </Box>
          <input
            type="file"
            accept=".docx"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            style={{ marginTop: "10px" }}
            disabled={loading}
          />
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        onClick={saveEditedDocx}
        sx={{ marginTop: "25px", width: "100%" }}
        disabled={loading}
      >
        Download Edited DOCX
      </Button>

      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: 3,
          height: { xs: "165vh", sm: "175vh", md: "auto", lg: "auto" },
          maxHeight: "900px",
          overflowY: "hidden",
        }}
      >
        <CardContent
          sx={{
            borderRadius: "10px",
            boxShadow: 3,
            height: { xs: "140vh", sm: "150vh", md: "auto", lg: "auto" },
            display: "flex",
            flexDirection: editorMode === "html" ? "row" : "column",
            gap: "20px",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Edit Document</Typography>
            <Divider />

            {editorMode === "html" && (
              <TextField
                multiline
                rows={15}
                fullWidth
                value={documentText}
                onChange={(e) => setDocumentText(formatHtml(e.target.value))}
                sx={{ marginTop: "10px", minHeight: "300px", height: "auto" }}
                disabled={loading}
              />
            )}

            {editorMode === "basic" && (
              <Box
                sx={{
                  flex: 1,
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <ReactQuill
                  value={documentText}
                  onChange={setDocumentText}
                  theme="snow"
                  style={{
                    flex: 1,
                    minHeight: "300px",
                    maxHeight: "60vh",
                    overflowY: "auto",
                    opacity: loading ? 0.6 : 1,
                  }}
                  readOnly={loading}
                />
              </Box>
            )}

            {editorMode === "advanced" && (
              <Box sx={{ marginTop: "10px", minHeight: "600px", height: "auto" }}>
                <Tinymce value={documentText} onChange={setDocumentText} disabled={loading} />
              </Box>
            )}
          </Box>

          {editorMode === "html" && (
            <Box
              sx={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                backgroundColor: "#fff",
                boxShadow: 3,
                height: "auto",
                overflowY: "auto",
                maxHeight: "600px",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Typography variant="h6">Live Preview</Typography>
              <Divider />
              <Box
                sx={{ marginTop: "10px", padding: "10px", minHeight: "85%" }}
                dangerouslySetInnerHTML={{ __html: documentText }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentEditor;
