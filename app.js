const express = require('express');
const multer = require('multer');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { pdfToPng } = require('pdf-to-png-converter');

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

// Helper: PDF మొదటి పేజీని latest-page1.png గా సేవ్ చేయడం
async function generateFirstPagePreview(pdfPath) {
    try {
        const pngPages = await pdfToPng(pdfPath, {
            pagesToProcess: [1],
            viewportScale: 1.5,
            disableFontFace: false,
            useSystemFonts: false
        });

        if (pngPages && pngPages.length > 0 && pngPages[0].content) {
            const previewPath = path.join(__dirname, 'latest-page1.png');
            fs.writeFileSync(previewPath, pngPages[0].content);
            console.log('మొదటి పేజీ ప్రివ్యూ సేవ్ అయ్యింది: latest-page1.png');
            return true;
        }
    } catch (err) {
        console.error('మొదటి పేజీ ఇమేజ్ మార్చడంలో లోపం:', err.message);
    }
    return false;
}

// API 1: PDF Upload Endpoint
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'pdf అప్‌లోడ్ కాలేదు' });
    }

    const uploadedFilePath = path.join(UPLOAD_DIR, req.file.filename);
    await generateFirstPagePreview(uploadedFilePath);

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
            const previewExists = fs.existsSync(path.join(__dirname, 'latest-page1.png'));
            const imageFile = previewExists ? 'latest-page1.png' : 'yuvagalam-logo.png';
            const versionTag = encodeURIComponent(pdfFile);
            const dynamicOgImage = `https://${req.get('host')}/${imageFile}?v=${versionTag}`;

            let updatedHtml = htmlData.replaceAll(
                'https://yuvagalam-epaper.onrender.com/yuvagalam-logo.png',
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
