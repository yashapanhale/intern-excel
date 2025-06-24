import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import UploadHistory from '../models/UploadHistory.js';
import ExcelData from '../models/ExcelData.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

//Route to get the history data:
router.get('/history', verifyToken, async (req, res) => {
  try {
    const uploads = await UploadHistory.find({ userID: req.user.id }).sort({ uploadDate: -1 });
    res.status(200).json({ history: uploads });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//Route to fetch the data from the history(just an experiment):
router.get('/data/:id', verifyToken, async (req, res) => {
  try {
    const record = await UploadHistory.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'File not found' });
    res.status(200).json({ data: record.rawData });
  } catch (err) {
    console.error('Specific file error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// data route to get data from the latest uploaded excel file:
router.get('/data', verifyToken, async (req, res) => {
  try {
    if (req.query.fresh !== 'true') {
      return res.status(204).json({ message: 'No fresh request' });
    }

    const latestData = await ExcelData.findOne({ userID: req.user.id }).sort({ uploadedAt: -1 });
    if (!latestData) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json({ data: latestData.data });
  } catch (err) {
    console.error('Fresh data error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

//fetches the data of the user themselves to show in the settings page:
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
