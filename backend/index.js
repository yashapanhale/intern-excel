import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import User from './Model/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;
const DBurl = process.env.MONGO_URI;

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
  userID: { type: String, required: true },
  data: { type: Array, required: true },
  uploadedAt: { type: Date, default: Date.now }
});
const ExcelData = mongoose.model('ExcelData', excelSchema, 'Excel_Data');

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join('uploads', req.user.id);
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
app.post('/upload', verifyToken,upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const fPath = req.file.path;
    const workbook = xlsx.readFile(fPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const newExData = new ExcelData({
      userID: req.user.id,
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

//Login page POST request:
app.post('/api/login', async(req,res)=>{
  try{
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if(!isCorrect){
      return res.status(401).json({ message: 'Invalid Email or Password'});
    }

    const token = jwt.sign({ id:user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(200).json({
      message: 'Login Successful',
      token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  }catch(err){
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server Error' });
  }
});

//middleware to verify JWT
function verifyToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token) return res.status(401).json({ message:'No token provided' });

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    res.status(403).json({ message:'Invalid Token' });
  }
};

app.get('/api/user/dashboard',  verifyToken, async(req,res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Welcome to the dashboard!', user });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Registration page POST request:

app.post('/api/register', async(req,res)=>{
  try{
    const {name, email, password } = req.body;

    if(!name || !email || !password){
      return res.status(400).json({ message:'All fields are required'});
    }

    const existingUser = await User.findOne({ email });
    if( existingUser ){
      return res.status(409).json({ message: "User's Email Already Exists!!!" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new User({
      name, email, password: hashPass,
    });

    await newUser.save();
    res.status(201).json({ message:'User Registered Successfully, Welcome to VisEx!!!' });
  }catch(err){
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
