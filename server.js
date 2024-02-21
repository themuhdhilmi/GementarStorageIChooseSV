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
        // Get the fileName from the request body
        const fileName = req.body.fileName;
        // Ensure fileName exists, otherwise use the original file name
        const finalFileName = fileName ? fileName : file.originalname;
        // Append .pdf extension
        cb(null, finalFileName + '.pdf');
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
        res.status(200).end("File is uploaded");
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
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
