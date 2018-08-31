//do spiced pg
const spicedPg = require("spiced-pg");
const secret = require("./secrets.json");
let dbUrl = `postgres:postgres:${secret.password}@localhost:5432/imageboard`;
const db = spicedPg(dbUrl);

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images
        ORDER BY id DESC
        LIMIT 10`);
};

module.exports.getMoreImages = function(lastImageId) {
    return db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 10`,
        [lastImageId]
    );
};

// `SELECT title, image, (
//     SELECT id FROM images
//     ORDER BY id ASC LIMIT 1
//     as last_id FROM images WHERE id = 3)`;

module.exports.checkWhichImgIsLastOnPage = function() {
    return db.query(`SELECT id FROM images ORDER BY id ASC LIMIT 1`);
};

module.exports.saveFile = function(url, username, title, description) {
    return db.query(
        `INSERT INTO
        images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING id, url, username, title, description, created_at
        `,
        [url, username, title, description]
    );
};

module.exports.getModalImage = function(serialId) {
    return db.query(`SELECT * FROM images WHERE id=$1`, [serialId]);
};

module.exports.saveComment = function(imageId, comment, username) {
    console.log(+imageId, typeof +imageId);
    return db.query(
        `INSERT INTO
        comments (image_id, comment,username)
        VALUES ($1,$2, $3)
        RETURNING id, image_id, comment, username, created_at`,
        [+imageId, comment, username]
    );
};

module.exports.getComments = function(imageId) {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1
        ORDER BY id DESC`,
        [imageId]
    );
};
