import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;
const DBurl = process.env.MONGO_URI;
const userID = 'DemoUser';

console.log("✅ MONGO_URI:", process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(DBurl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});

// Mongoose Schema
const excelSchema = new mongoose.Schema({
  username: { type: String, required: true },
  data: { type: Array, required: true },
  uploadedAt: { type: Date, default: Date.now }
});
const ExcelData = mongoose.model('ExcelData', excelSchema, 'Excel_Data');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join('uploads', userID);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Only CSV or Excel files allowed'));
};
const upload = multer({ storage, fileFilter });

// Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const fPath = req.file.path;
    const workbook = xlsx.readFile(fPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const newExData = new ExcelData({
      username: userID,
      data: data,
    });

    await newExData.save();
    fs.unlinkSync(fPath);

    res.json({
      message: '✅ File parsed and saved successfully',
      data: data,
    });
  } catch (err) {
    console.error('❌ Error saving file:', err);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
