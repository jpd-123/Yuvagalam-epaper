const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Render Proxy Support (Fixes protocol http/https issues)
app.set('trust proxy', 1);

// Increase Payload Limit for large JSON/Forms
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Uploads Directory Setup
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
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

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB వరకు అనుమతి
});

// Serve Static Files
app.use(express.static(__dirname));
app.use('/uploads', express.static(UPLOAD_DIR));

// API 1: PDF Upload Endpoint
app.post('/api/upload', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'pdf అప్‌లోడ్ కాలేదు' });
    }
    
    // Relative Path ఇవ్వడం వల్ల HTTP/HTTPS ప్రొటోకాల్ సమస్య రాదు
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl, filename: req.file.filename });
});
// WhatsApp Dynamic Link Meta Tags Route
app.get('/', (req, res) => {
    const pdfFile = req.query.pdf;
    const indexPath = path.join(__dirname, 'index.html');
    
    fs.readFile(indexPath, 'utf8', (err, htmlData) => {
        if (err) {
            return res.status(500).send('Error loading page');
        }
        
        if (pdfFile) {
            // PDF ఫైల్ ఉంటే డిఫాల్ట్ లోగో ఇమేజ్ స్థానంలో పబ్లిక్ లింక్ ద్వారా సర్వ్ అవుతుంది
            const dynamicOgImage = `https://${req.get('host')}/logo.png.jpg`;
            let updatedHtml = htmlData.replace(
                'https://yuvagalam-epaper.onrender.com/logo.png.jpg',
                dynamicOgImage
            );
            return res.send(updatedHtml);
        }
        
        res.send(htmlData);
    });
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

                if (now - stats.mtimeMs > fiveDaysInMillis) {
                    fs.unlink(filePath, err => {
                        if (err) console.error(`Error deleting file ${file}:`, err);
                        else console.log(`పాత ఫైల్ డిలీట్ అయ్యింది: ${file}`);
                    });
                }
            });
        });
    });
});

// Start Server with Timeout
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.timeout = 300000; // 5 నిమిషాల సమయం
