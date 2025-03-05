const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdf2table = require("pdf2table");
const PdfData = require("../models/pdfData");

const router = express.Router();

// Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer setup for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// Function to extract tables using pdf2table and structure properly
const extractTables = (pdfPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(pdfPath, (err, buffer) => {
      if (err) return reject("Error reading PDF file.");

      pdf2table.parse(buffer, (err, rows) => {
        if (err) return reject("Error extracting tables.");
        if (!rows || rows.length === 0) return reject("No tables found in PDF.");

        let tables = [];
        let currentTable = [];

        rows.forEach((row) => {
          if (row.length > 1 && !row.includes("page_number") && !row.includes("content")) {
            currentTable.push(row);
          } else if (currentTable.length > 0) {
            tables.push(currentTable);
            currentTable = [];
          }
        });

        if (currentTable.length > 0) tables.push(currentTable);

        resolve(tables);
      });
    });
  });
};

// Route to upload PDF and extract tables
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const pdfPath = req.file.path;

  try {
    if (path.extname(req.file.originalname).toLowerCase() !== ".pdf") {
      throw new Error("Invalid file type. Please upload a PDF.");
    }

    const extractedTables = await extractTables(pdfPath);

    if (!extractedTables || extractedTables.length === 0) {
      throw new Error("No tables found in PDF.");
    }

    // Store extracted data
    const pdfData = new PdfData({
      filename: req.file.originalname,
      tables: extractedTables,
    });

    await pdfData.save();

    res.json({
      message: "PDF processed, tables extracted successfully.",
      filename: req.file.originalname,
      tables: extractedTables,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: error.message || "Failed to process PDF." });
  } finally {
    // Ensure file is deleted after processing
    if (fs.existsSync(pdfPath)) {
      fs.unlink(pdfPath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
  }
});




module.exports = router;
