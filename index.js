const express = require("express");
const app = express();
const { getImages, saveFile } = require("./dbRequests");
const bodyParser = require("body-parser");
const s3 = require("./s3.js");
const config = require("./config.json");

app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);

// BOILERPLATE FOR IMAGE UPLOAD
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

let diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

let uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//END OF BOILERPLATE FOR IMAGE UPLOAD
app.use(express.static("./public"));

app.get("/home", (req, res) => {
    //make request.then send it back to vue
    getImages().then(function(data) {
        res.json(data.rows);
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("POST / UPLOAD IN SERVER", req.file);
    saveFile(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
    ).then(function(data) {
        res.json(data.rows);
    });
});

app.listen(8080, () => console.log(`I'm listening`));
