const mongoose = require("mongoose");

const PdfDataSchema = new mongoose.Schema({
  filename: String,
  tables: Array,
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PdfData", PdfDataSchema);
