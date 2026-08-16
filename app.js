const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Uploads Directory
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR);
}

// Multer Storage Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// Serve Static Files
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOAD_DIR));

// API 1: PDF Upload Endpoint
app.post('/api/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'ఫైల్ అప్‌లోడ్ కాలేదు' });
    }
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
});

// CRON JOB: Every day at midnight (00:00), delete files older than 5 days
cron.schedule('0 0 * * *', () => {
    console.log('5 రోజుల కంటే పాత PDFల డిలీషన్ చెక్ చేస్తున్నాం...');
    const fiveDaysInMillis = 5 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return console.error('Uploads folder read error:', err);

        files.forEach(file => {
            const filePath = path.join(UPLOAD_DIR, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                
                // File age check
                if (now - stats.mtimeMs > fiveDaysInMillis) {
                    fs.unlink(filePath, err => {
                        if (err) console.error(`Error deleting file ${file}:`, err);
                        else console.log(`ఆటో డిలీట్ అయ్యింది: ${file}`);
                    });
                }
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
