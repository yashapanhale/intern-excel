import express from 'express';
import User from '../models/user.js';
import ExcelData from '../models/ExcelData.js';
import UploadHistory from '../models/UploadHistory.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalFiles = await UploadHistory.countDocuments();
    const recentUpload = await UploadHistory.findOne({})
      .sort({ uploadDate: -1 })
      .populate('userID', 'name email');

    res.json({
      totalUsers,
      totalFiles,
      totalAdmins,
      recentUploader: recentUpload && recentUpload.userID
        ? {
            name: recentUpload.userID.name,
            email: recentUpload.userID.email
          }
        : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user-growth', async (req, res) => {
  try {
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const dates = userGrowth.map(item => item._id);
    const counts = userGrowth.map(item => item.count);
    res.json({ dates, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "uploadhistories",
          localField: "_id",
          foreignField: "userID",
          as: "uploads"
        }
      },
      {
        $project: {
          username: "$name",
          email: 1,
          role: 1,
          fileCount: { $size: "$uploads" }
        }
      }
    ]);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/all-uploads', async (req, res) => {
  try {
    const uploads = await UploadHistory.find({})
      .populate('userID', 'name email') 
      .sort({ uploadDate: -1 }); 
    const result = uploads.map(upload => ({
      _id: upload._id,
      fileName: upload.fileName,
      uploadDate: upload.uploadDate,
      user: upload.userID ? {
        name: upload.userID.name,
        email: upload.userID.email
      } : { name: "Unknown", email: "" }
    }));

    res.json({ uploads: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;