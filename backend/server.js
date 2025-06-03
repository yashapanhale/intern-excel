import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const port = 3000;

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: (req,file,cb) => cb(null, 'uploads/'),
    filename: (req,file,cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [ 'text/csv', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
    ];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only CSV or Excel files allowed'));
};

const upload = multer({ storage, fileFilter});

app.post('/upload', upload.single('file'), (req,res) => {
    if(!req.file) return res.status(400).json({ error: 'No file uploaded' });
    res.json({ message: 'File uploaded', file: req.file});
});

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});