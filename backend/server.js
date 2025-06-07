import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import xlsx from 'xlsx';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const DBurl = process.env.MongoDB_uri;
const port = 3000;

const app = express();
app.use(cors());

mongoose.connect(DBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(() => console.log('Connected to MongoDB successfully!!!'))
.catch(err => console.error('Could not connect database: ', err));

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const userID = 'DemoUser';
        const userDir = path.join('uploads', userID);

        if(!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, {recursive: true});
        }
        cb(null, userDir);
    },
    filename: (req,file,cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
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

    try{
        const fPath = req.file.path;
        const workbook = xlsx.readFile(fPath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        console.log(data);
        //fs.unlinkSync(fPath);

        res.json({
            message: 'File Parsed Successfully',
            data: data,
        });
    }catch(err){
        console.error('Error parsing file: ', err);
        res.status(500).json({error: 'Failed to parse the Excel file'});
    };
});

app.listen(port, () => {
    console.log(`Server is up and running on ${port}`);
});