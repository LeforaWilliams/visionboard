//do spiced pg
const spicedPg = require("spiced-pg");
const secret = require("./secrets.json");
let dbUrl = `postgres:postgres:${secret.password}@localhost:5432/imageboard`;
const db = spicedPg(dbUrl);

module.exports.getImages = function() {
    return db.query(`SELECT * FROM images`);
};
