import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { saveAs } from "file-saver";
import Mammoth from "mammoth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import htmlDocx from "html-docx-js/dist/html-docx";
import { Box, Button, Card, CardContent, Divider, Typography, TextField } from "@mui/material";
import Tinymce from "./tinymce";

const DocumentEditor = () => {
    const [documentText, setDocumentText] = useState("");
    const [editorMode, setEditorMode] = useState("basic");

    const formatHTML = (html) => {
        return html.replace(/>(?=[^\n])/g, ">\n").trim();
    };

    useEffect(() => {
        setDocumentText((prev) => formatHTML(prev));
    }, []);

    const handleFileUpload = async (file) => {
        if (!file || !file.name.endsWith(".docx")) {
            alert("Please upload a valid .docx file!");
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const arrayBuffer = e.target.result;
            const result = await Mammoth.convertToHtml({ arrayBuffer });
            setDocumentText(formatHTML(result.value));
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
        <Box sx={{ display: "flex", flexDirection: "column", height: "190vh", padding: "20px", gap: "20px" }}>
            <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <Typography>Choose Editor Mode:</Typography>
                <Button variant={editorMode === "basic" ? "contained" : "outlined"} onClick={() => setEditorMode("basic")}>BASIC</Button>
                <Button variant={editorMode === "html" ? "contained" : "outlined"} onClick={() => setEditorMode("html")}>HTML</Button>
                <Button variant={editorMode === "advanced" ? "contained" : "outlined"} onClick={() => setEditorMode("advanced")}>Advanced</Button>
            </Box>

            <Card sx={{ borderRadius: "10px", boxShadow: 3, height: "50vh", maxHeight: "600px" }}>
                <CardContent>
                    <Typography variant="h6">Upload and Edit Document</Typography>
                    <Divider />
                    <Box {...getRootProps()} sx={{
                        marginTop: "10px", padding: "20px", border: "2px dashed #aaa",
                        backgroundColor: isDragActive ? "#e3f2fd" : "#fafafa",
                    }}>
                        <input {...getInputProps()} />
                        <Typography>{isDragActive ? "Drop the file here..." : "Drag & drop a .docx file here, or click to select one"}</Typography>
                    </Box>
                    <input type="file" accept=".docx" onChange={(e) => handleFileUpload(e.target.files[0])} style={{ marginTop: "10px" }} />
                </CardContent>
            </Card>

            <Button variant="contained" color="secondary" onClick={saveEditedDocx} sx={{ marginTop: "25px", width: "100%" }}>
                Download Edited DOCX
            </Button>

            <Card sx={{
    borderRadius: "10px",
    boxShadow: 3,
    height: { xs: "140vh", sm: "170vh", md: "190vh", lg: "210vh" }, // Increased height
    maxHeight: "2200px", // Increased max height

    mb: "50px" // Bottom margin for spacing
}}>

              <CardContent sx={{
    borderRadius: "10px",
    boxShadow: 3,
    height: { xs: "130vh", sm: "160vh", md: "180vh", lg: "200vh" }, // Increased height
    display: "flex",
    flexDirection: editorMode === "html" ? "row" : "column",
    gap: "20px"
}}>

                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">Edit Document</Typography>
                        <Divider />

                        {/* HTML Mode: Raw Text Editor */}
                        {editorMode === "html" && (
                            <TextField
                                multiline
                                rows={20} // Increased rows for better space
                                fullWidth
                                value={documentText}
                                onChange={(e) => setDocumentText(formatHTML(e.target.value))}
                                sx={{ marginTop: "10px", fontFamily: "monospace" }}
                            />
                        )}

                        {/* Basic Mode: WYSIWYG Editor (ReactQuill) */}
                        {editorMode === "basic" && (
                            <ReactQuill value={documentText} onChange={setDocumentText} theme="snow" style={{ height: "400px" }} />
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
                            <Box sx={{ marginTop: "10px", padding: "10px", minHeight: "95%" }} dangerouslySetInnerHTML={{ __html: documentText }} />
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default DocumentEditor;
