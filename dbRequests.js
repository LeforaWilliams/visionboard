//do spiced pg
const spicedPg = require("spiced-pg");
const secret = require("./secrets.json");
let dbUrl = `postgres:postgres:${secret.password}@localhost:5432/imageboard`;
const db = spicedPg(dbUrl);

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images
        ORDER BY id DESC`);
};

module.exports.saveFile = function(url, username, title, description) {
    return db.query(
        `INSERT INTO
        images (url, username, title, description) VALUES($1, $2, $3, $4) RETURNING id, url, username, title, description
        `,
        [url, username, title, description]
    );
};
