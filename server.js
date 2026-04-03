const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// TVOJ NOVÝ LINK (Nezabudni prepísať <db_password> na tvoje heslo!)
const MONGO_URI = 'mongodb+srv://RibomX:bBa9bfKCgfYfD5vj@files.d4dcu2k.mongodb.net/?appName=Files'; 

// KONFIGURÁCIA CLOUDINARY (tvoje údaje)
cloudinary.config({ 
  cloud_name: 'dejdjlbfk', 
  api_key: '299794196721819', 
  api_secret: 'Cn5KTMB5_CrKu7YJH-C2m2s80hU' 
});

// Pripojenie k databáze
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schéma pre databázu
const fileSchema = new mongoose.Schema({
    password: { type: String, required: true, unique: true },
    url: String,
    public_id: String,
    originalName: String,
    expiry: Number
});
const File = mongoose.model('File', fileSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// API NA NAHRÁVANIE
app.post('/upload', upload.single('file'), async (req, res) => {
    const password = req.body.password;
    if (!req.file || !password) return res.status(400).send('Chýba súbor alebo heslo.');

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
                    expiry: Date.now() + (3 * 60 * 60 * 1000) // 3 hodín
                });
                res.send({ success: true });
            } catch (dbErr) {
                res.status(500).send("Chyba databázy (možno už heslo existuje).");
            }
        } else {
            res.status(500).send(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
});

// API NA STIAHNUTIE (Hľadanie v DB)
app.post('/check-password', async (req, res) => {
    try {
        const fileData = await File.findOne({ password: req.body.password });
        if (fileData) {
            res.send({ found: true, url: fileData.url, name: fileData.originalName });
        } else {
            res.send({ found: false });
        }
    } catch (err) {
        res.status(500).send("Chyba pri hľadaní v databáze.");
    }
});

// AUTOMATICKÝ ČISTIČ (každých 10 minút)
setInterval(async () => {
    try {
        const expiredFiles = await File.find({ expiry: { $lt: Date.now() } });
        for (const file of expiredFiles) {
            await cloudinary.uploader.destroy(file.public_id);
            await File.deleteOne({ _id: file._id });
            console.log(`🗑️ Automaticky zmazané: ${file.password}`);
        }
    } catch (err) {
        console.error("Chyba čističa:", err);
    }
}, 600000);

app.listen(PORT, () => {
    console.log(`🚀 Server live na porte ${PORT}`);
});
