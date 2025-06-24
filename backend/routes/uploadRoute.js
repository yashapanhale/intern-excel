import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import { verifyToken } from '../middleware/auth.js';
import UploadHistory from '../models/UploadHistory.js';
import ExcelData from '../models/ExcelData.js';
import mongoose from 'mongoose';

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join('backend/uploads', req.user.id);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter });

// Upload Endpoint
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const ExcelData = mongoose.model('ExcelData');
    await new ExcelData({
      userID: req.user.id,
      originalFileName: req.file.originalname,
      data,
    }).save();

    const headers = Object.keys(data[0] || {});
    await new UploadHistory({
      userID: req.user.id,
      fileName: req.file.originalname,
      headers,
      rawData: data,
    }).save();

    fs.unlinkSync(req.file.path);
    res.json({ message: '✅ File uploaded and saved', data });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to process file' });
  }
});

// gets the data from the recently uploaded excel file:
router.get('/data', verifyToken, async (req, res) => {
  const ExcelData = mongoose.model('ExcelData');
  try {
    if (req.query.fresh !== 'true')
      return res.status(204).json({ message: 'No fresh request' });

    const latestUpload = await ExcelData.findOne({ userID: req.user.id }).sort({ uploadedAt: -1 });
    if (!latestUpload)
      return res.status(404).json({ message: 'No data found' });

    res.status(200).json({ data: latestUpload.data });
  } catch (err) {
    console.error('Data fetch error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Dashboard route:
router.post('/dashboard', verifyToken, upload.single('file'), async (req, res) => {
  try {
    console.log(' Upload route hit!');
    console.log(' File received:', req.file.originalname);

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(' Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;