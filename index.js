const express = require("express");
const app = express();
const {
    getImages,
    saveFile,
    getModalImage,
    saveComment,
    getComments,
    getMoreImages,
    checkWhichImgIsLastOnPage
} = require("./dbRequests");
const s3 = require("./s3.js");
const config = require("./config.json");

app.use(require("body-parser").json());

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

app.get("/images", (req, res) => {
    //make request.then send it back to vue
    // getImages().then(function(data) {
    //     res.json(data.rows);
    // });
    return Promise.all([getImages(req.params.id), checkWhichImgIsLastOnPage()])
        .then(function([nextImages, lastId]) {
            res.json({ images: nextImages.rows, id: lastId.rows[0].id });
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    saveFile(
        config.s3Url + req.file.filename,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then(function(data) {
            res.json(data.rows);
        })
        .catch(function(err) {
            console.log("ERROR FROM CATCH IN UPLOAD SERVER ROUTE: ", err);
            res.sendStatus(500);
        });
});

app.get("/image/:id", (req, res) => {
    getModalImage(req.params.id)
        .then(function(image) {
            res.json(image.rows[0]);
        })
        .catch(function(err) {
            console.log(
                "ERROR FROM CATCH IN GET IMAGE FOR MODAL ROUTE ON SERVER",
                err
            );
            res.json();
            res.sendStatus(500);
        });
});

app.post("/comments/:id", (req, res) => {
    saveComment(req.params.id, req.body.comment, req.body.username)
        .then(function(commentInfo) {
            res.json(commentInfo.rows);
        })
        .catch(function(err) {
            console.log("ERROR IN COMMENTS POST ROUTE ON SERVER: ", err);
            res.sendStatus(500);
        });
});

app.get("/comments/:id", (req, res) => {
    getComments(req.params.id)
        .then(function(comments) {
            res.json(comments.rows);
        })
        .catch(function(err) {
            console.log("ERROR IN GET COMMENTS ON SERVER", err);
            res.sendStatus(500);
        });
});
app.get("/get-more-images/:id", (req, res) => {
    return Promise.all([
        getMoreImages(req.params.id),
        checkWhichImgIsLastOnPage()
    ])
        .then(function([nextImages, lastId]) {
            res.json({ images: nextImages.rows, id: lastId.rows[0].id });
        })
        .catch(function(err) {
            console.log(err);
        });

    // getMoreImages(req.params.id)
    //     .then(function(result) {
    //         res.json(result.rows);
    //     })
    //     .catch(function(err) {
    //         console.log(err);
    //     });
});

app.listen(8080, () => console.log(`I'm listening`));
