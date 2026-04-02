const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Databáza súborov v pamäti
let fileDatabase = {}; 

// Nastavenie ukladania súborov
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/download', express.static('uploads'));

// API na nahrávanie
app.post('/upload', upload.single('file'), (req, res) => {
    const password = req.body.password;
    if (!req.file || !password) return res.status(400).send('Chýba súbor alebo heslo.');

    fileDatabase[password] = {
        path: req.file.filename,
        originalName: req.file.originalname,
        expiry: Date.now() + (5 * 60 * 60 * 1000) // 5 hodín
    };
    res.send({ success: true });
});

// API na hľadanie súboru podľa hesla
app.post('/check-password', (req, res) => {
    const fileData = fileDatabase[req.body.password];
    if (fileData) {
        res.send({ found: true, url: `/download/${fileData.path}`, name: fileData.originalName });
    } else {
        res.send({ found: false });
    }
});

// Automatické mazanie každých 10 minút
setInterval(() => {
    const now = Date.now();
    for (const pass in fileDatabase) {
        if (now > fileDatabase[pass].expiry) {
            const filePath = path.join(__dirname, 'uploads', fileDatabase[pass].path);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            delete fileDatabase[pass];
            console.log(`Zmazaný expirovaný súbor pod heslom: ${pass}`);
        }
    }
}, 600000);

app.listen(PORT, () => console.log(`Server beží na http://localhost:${PORT}`));