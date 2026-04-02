const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const app = express();
const PORT = process.env.PORT || 3000;

// TVOJA KONFIGURÁCIA CLOUDINARY
cloudinary.config({ 
  cloud_name: 'dejdjlbfk', 
  api_key: '299794196721819', 
  api_secret: 'Cn5KTMB5_CrKu7YJH-C2m2s80hU' 
});

let fileDatabase = {}; 

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));

// API na nahrávanie do Cloudinary
app.post('/upload', upload.single('file'), (req, res) => {
    const password = req.body.password;
    if (!req.file || !password) return res.status(400).send('Missing file or password.');

    let stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: `file_${Date.now()}` },
      (error, result) => {
        if (result) {
            fileDatabase[password] = {
                url: result.secure_url,
                public_id: result.public_id,
                originalName: req.file.originalname,
                expiry: Date.now() + (5 * 60 * 60 * 1000)
            };
            res.send({ success: true });
        } else {
            res.status(500).send(error);
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
});

// API na hľadanie
app.post('/check-password', (req, res) => {
    const fileData = fileDatabase[req.body.password];
    if (fileData) {
        res.send({ found: true, url: fileData.url, name: fileData.originalName });
    } else {
        res.send({ found: false });
    }
});

// Čistič - zmaže z databázy aj z Cloudinary po 5h
setInterval(async () => {
    const now = Date.now();
    for (const pass in fileDatabase) {
        if (now > fileDatabase[pass].expiry) {
            const pid = fileDatabase[pass].public_id;
            await cloudinary.uploader.destroy(pid).catch(err => console.log("Cloudinary delete error:", err));
            delete fileDatabase[pass];
            console.log(`Deleted expired file: ${pass}`);
        }
    }
}, 600000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));