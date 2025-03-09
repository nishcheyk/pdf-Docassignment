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
} from "@mui/material";
import Tinymce from "./tinymce";
import beautify from "js-beautify";

const DocumentEditor = () => {
  const [documentText, setDocumentText] = useState("");
  const [editorMode, setEditorMode] = useState("basic"); // Modes: "basic", "html", "advanced"

  const formatHtml = (html) => {
    return beautify.html(html, { indent_size: 2, wrap_line_length: 0 });
  };

  const handleFileUpload = async (file) => {
    if (!file || !file.name.endsWith(".docx")) {
      alert("Please upload a valid .docx file!");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const result = await Mammoth.convertToHtml({ arrayBuffer });
      setDocumentText(formatHtml(result.value)); // Format HTML on upload
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

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
      <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <Typography>Choose Editor Mode:</Typography>
        <Button
          variant={editorMode === "basic" ? "contained" : "outlined"}
          onClick={() => setEditorMode("basic")}
        >
          BASIC
        </Button>
        <Button
          variant={editorMode === "html" ? "contained" : "outlined"}
          onClick={() => setEditorMode("html")}
        >
          HTML
        </Button>
        <Button
          variant={editorMode === "advanced" ? "contained" : "outlined"}
          onClick={() => setEditorMode("advanced")}
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
              cursor: "pointer",
              backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
            }}
          >
            <input {...getInputProps()} />
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
          />
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="secondary"
        onClick={saveEditedDocx}
        sx={{ marginTop: "25px", width: "100%" }}
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
                  }}
                />
              </Box>
            )}

            {editorMode === "advanced" && (
              <Tinymce value={documentText} onChange={setDocumentText} />
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
                overflowY: "auto", // Scroll if content is large
                maxHeight: "600px", // Optional: Limit max height
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
