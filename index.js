const express = require("express");
const app = express();
const { getImages } = require("./dbRequests");

app.use(express.static("./public"));

app.get("/home", (req, res) => {
    //make request.then send it back to vue
    getImages().then(function(data) {
        res.json(data.rows);
    });
});

app.listen(8080, () => console.log(`I'm listening`));
