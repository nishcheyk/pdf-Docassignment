const fs = require("fs");
const pdfParse = require("pdf-parse");
const PDFParser = require("pdf2json");

// Function to extract text & tables from PDF
const extractDataFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    return {
      text: data.text, // Extracted text
      info: data.info, // Metadata
    };
  } catch (error) {
    throw new Error("Failed to extract data from PDF");
  }
};

// Function to extract structured tables using pdf2json
const extractTablesFromPDF = (filePath) => {
  return new Promise((resolve, reject) => {
    let pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err) => reject(err));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      resolve(pdfData);
    });

    pdfParser.loadPDF(filePath);
  });
};

module.exports = { extractDataFromPDF, extractTablesFromPDF };
