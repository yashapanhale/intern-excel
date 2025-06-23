import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import authRoute from './routes/authRoute.js';
import uploadRoute from './routes/uploadRoute.js';
import historyRoute from './routes/historyRoute.js';
import { routeLogger } from './middleware/routeLogger.js';
import adminRoutes from './routes/admin.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;
const DBurl = process.env.MONGO_URI;

//console.log('URL:', DBurl);

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

//routes:
app.use('/api',authRoute);
app.use('/upload', uploadRoute);
app.use('/api/user', historyRoute);
app.use(routeLogger);
app.use('/api/admin', adminRoutes);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});