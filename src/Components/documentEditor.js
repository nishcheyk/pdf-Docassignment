import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import Mammoth from "mammoth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import htmlDocx from "html-docx-js/dist/html-docx";
import { Box, Button, Card, CardContent, Divider, Typography, TextField } from "@mui/material";
import Tinymce from "./tinymce";

const DocumentEditor = () => {
    // State to store document text content
    const [documentText, setDocumentText] = useState("");

    // State to track the selected editor mode
    const [editorMode, setEditorMode] = useState("basic"); // Modes: "basic", "html", "advanced"

    /**
     * Handles file upload, extracts text from a .docx file using Mammoth.
     * @param {File} file - Uploaded file object
     */
    const handleFileUpload = async (file) => {
        if (!file || !file.name.endsWith(".docx")) {
            alert("Please upload a valid .docx file!");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const result = await Mammoth.convertToHtml({ arrayBuffer });
            setDocumentText(result.value);
        };
        reader.readAsArrayBuffer(file);
    };

    /**
     * Handles file drop event for drag-and-drop upload.
     * @param {Array} acceptedFiles - Array of dropped files
     */
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            handleFileUpload(acceptedFiles[0]);
        }
    }, []);

    // React Dropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".docx",
        multiple: false,
    });

    /**
     * Converts the edited document content into a .docx file and triggers download.
     */
    const saveEditedDocx = () => {
        const htmlContent = `<html><body>${documentText}</body></html>`;
        const converted = htmlDocx.asBlob(htmlContent);
        saveAs(converted, "edited-document.docx");
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", padding: "20px", gap: "20px" }}>

            {/* Editor Mode Selection Buttons */}
            <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Typography>Choose Editor Mode:</Typography>
                <Button variant={editorMode === "basic" ? "contained" : "outlined"} onClick={() => setEditorMode("basic")}>BASIC</Button>
                <Button variant={editorMode === "html" ? "contained" : "outlined"} onClick={() => setEditorMode("html")}>HTML</Button>
                <Button variant={editorMode === "advanced" ? "contained" : "outlined"} onClick={() => setEditorMode("advanced")}>Advanced</Button>
            </Box>

            {/* File Upload Section */}
            <Card sx={{ borderRadius: "10px", boxShadow: 3, height: "70vh", maxHeight: "600px" }}>
                <CardContent>
                    <Typography variant="h6">Upload and Edit Document</Typography>
                    <Divider />
                    <Box {...getRootProps()} sx={{
                        marginTop: "10px", padding: "20px", border: "2px dashed #aaa",
                        borderRadius: "10px", textAlign: "center", cursor: "pointer",
                        backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
                    }}>
                        <input {...getInputProps()} />
                        <Typography>{isDragActive ? "Drop the file here..." : "Drag & drop a .docx file here, or click to select one"}</Typography>
                    </Box>
                    <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e.target.files[0])} style={{ marginTop: "10px" }} />
                </CardContent>
            </Card>

            {/* Download Edited DOCX Button */}
            <Button variant="contained" color="secondary" onClick={saveEditedDocx} sx={{ marginTop: "25px", width: "100%" }}>
                Download Edited DOCX
            </Button>

            {/* Document Editing Section */}
            <Card sx={{
                borderRadius: "10px",
                boxShadow: 3,
                height: { xs: "95vh", sm: "115vh", md: "125vh", lg: "135vh" },
                maxHeight: "900px",
                overflowY: "hidden"
            }}>
                <CardContent sx={{
                    borderRadius: "10px",
                    boxShadow: 3,
                    height: { xs: "90vh", sm: "110vh", md: "120vh", lg: "130vh" },
                    display: "flex",
                    flexDirection: editorMode === "html" ? "row" : "column",
                    gap: "20px"
                }}>
                    {/* Editor Selection Based on Mode */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Edit Document</Typography>
                        <Divider />

                        {/* HTML Mode: Raw Text Editor */}
                        {editorMode === "html" && (
                            <TextField multiline rows={15} fullWidth value={documentText} onChange={(e) => setDocumentText(e.target.value)} sx={{ marginTop: "10px" }} />
                        )}

                        {/* Basic Mode: WYSIWYG Editor (ReactQuill) */}
                        {editorMode === "basic" && (
                            <ReactQuill value={documentText} onChange={setDocumentText} theme="snow" style={{ height: "300px" }} />
                        )}

                        {/* Advanced Mode: TinyMCE Editor */}
                        {editorMode === "advanced" && (
                            <Tinymce value={documentText} onChange={setDocumentText} />
                        )}
                    </Box>

                    {/* Live Preview for HTML Mode */}
                    {editorMode === "html" && (
                        <Box sx={{
                            flex: 1,
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: 3,
                            height: "100%",
                            overflowY: "auto"
                        }}>
                            <Typography variant="h6">Live Preview</Typography>
                            <Divider />
                            <Box sx={{ marginTop: "10px", padding: "10px", minHeight: "85%" }} dangerouslySetInnerHTML={{ __html: documentText }} />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DocumentEditor;
