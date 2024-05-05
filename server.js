const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(cors({
    origin: '*'
}));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {

        const fileName = req.body.fileName;
        const finalFileName = fileName ? fileName : file.originalname;
        const ext = path.extname(file.originalname);
        const finalFileNameWithExt = finalFileName + ext;

        cb(null, finalFileNameWithExt);
    }
});

const upload = multer({storage : storage}).single('file');

app.get('/', (req,res) => {
    res.send("GementarTeam.");
});

app.post('/gementar/storage/upload', (req,res) => {
    upload(req,res,function(err) {
        if(err) {
            return res.status(400).end("Error uploading file." + err);
        }

        const uploadedFileName = req.file.filename;
        const jsonData = {
            path : '/gementar/storage/file/' + uploadedFileName
        }
        res.status(200).setHeader('Content-Type', 'application/json').end(JSON.stringify(jsonData, null, 3));
    });
});

// Access uploaded image by filename
app.get('/gementar/storage/file/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'uploads', filename);

    // Check if file exists
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).end("File not found");
        }
        // Stream the image file to the response
        const imageStream = fs.createReadStream(imagePath);
        imageStream.pipe(res);
    });
});

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
