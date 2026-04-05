const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const mongoose = require('mongoose');

// --- PRIDANÉ PRE SKETCHBOOK ---
const { exec } = require('child_process');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// TOTO zabezpečí funkčnosť FFmpeg na Renderi bez Buildpackov
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpegPath = ffmpegInstaller.path;
// ------------------------------

const app = express();
const PORT = process.env.PORT || 10000; // Zmenené na 10000 pre Render

// TVOJ LINK NA DB
const MONGO_URI = 'mongodb+srv://RibomX:bBa9bfKCgfYfD5vj@files.d4dcu2k.mongodb.net/?appName=Files'; 

cloudinary.config({ 
  cloud_name: 'dejdjlbfk', 
  api_key: '299794196721819', 
  api_secret: 'Cn5KTMB5_CrKu7YJH-C2m2s80hU' 
});

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const fileSchema = new mongoose.Schema({
    password: { type: String, required: true, unique: true },
    url: String,
    public_id: String,
    originalName: String,
    expiry: Number
});
const File = mongoose.model('File', fileSchema);

// Multer nastavený tak, aby ukladal do 'uploads' priečinka (potrebné pre FFmpeg)
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public'));

// NAHRÁVANIE (Pôvodné)
app.post('/upload', upload.single('file'), async (req, res) => {
    const password = req.body.password;
    if (!req.file || !password) return res.status(400).json({ error: 'Chýba súbor alebo heslo.' });

    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: `file_${Date.now()}` },
      async (error, result) => {
        if (result) {
            try {
                await File.create({
                    password: password,
                    url: result.secure_url,
                    public_id: result.public_id,
                    originalName: req.file.originalname,
                    expiry: Date.now() + (3 * 60 * 60 * 1000)
                });
                res.json({ success: true });
                // Zmazať dočasný súbor z disku po nahratí na Cloudinary
                if (req.file.path) fs.unlinkSync(req.file.path);
            } catch (dbErr) {
                res.status(500).json({ error: "Heslo už existuje." });
            }
        } else {
            res.status(500).json({ error: "Cloudinary error" });
        }
      }
    );
    fs.createReadStream(req.file.path).pipe(stream);
});

// --- NOVÁ ČASŤ: VIDEO TO SKETCHBOOK ---
app.post('/process-sketchbook', upload.single('video'), (req, res) => {
    if (!req.file) return res.status(400).send('No video uploaded.');

    const videoPath = req.file.path;
    const folderName = 'frames_' + Date.now();
    const outputFolder = path.join(__dirname, folderName);
    
    if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

    // OPRAVA PRE RENDER: Nastavenie povolení na spustenie FFmpeg
    try {
        fs.chmodSync(ffmpegPath, '755');
    } catch (err) {
        console.log("Permission fix error:", err);
    }

    // Príkaz pre FFmpeg s použitím správnej cesty
    const ffmpegCmd = `"${ffmpegPath}" -i ${videoPath} -vf "select=not(mod(n\,10))" -vsync vfr ${outputFolder}/frame_%03d.jpg`;

    exec(ffmpegCmd, (error) => {
        if (error) {
            console.error('FFmpeg error:', error);
            return res.status(500).send('Error processing video.');
        }

        const zipPath = videoPath + '.zip';
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip');

        output.on('close', () => {
            res.download(zipPath, 'sketchbook.zip', () => {
                // Upratovanie po stiahnutí
                try {
                    if (fs.existsSync(outputFolder)) fs.rmSync(outputFolder, { recursive: true, force: true });
                    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
                } catch (e) { console.log("Cleanup error:", e); }
            });
        });

        archive.pipe(output);
        archive.directory(outputFolder, false);
        archive.finalize();
    });
});
// --------------------------------------

app.get('/check-password', async (req, res) => {
    try {
        const password = req.query.password; 
        const fileData = await File.findOne({ password: password });
        
        if (fileData) {
            res.json({ found: true, url: fileData.url, name: fileData.originalName });
        } else {
            res.json({ found: false });
        }
    } catch (err) {
        res.status(500).json({ error: "Chyba DB" });
    }
});

// ČISTIČ
setInterval(async () => {
    try {
        const expiredFiles = await File.find({ expiry: { $lt: Date.now() } });
        for (const file of expiredFiles) {
            await cloudinary.uploader.destroy(file.public_id);
            await File.deleteOne({ _id: file._id });
            console.log(`🗑️ Zmazané: ${file.password}`);
        }
    } catch (err) {
        console.error("Chyba čističa:", err);
    }
}, 600000);

app.listen(PORT, () => {
    console.log(`🚀 Server live na porte ${PORT}`);
});
