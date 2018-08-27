(function() {
    var app = new Vue({
        el: ".imageboard-wrap",
        data: {
            images: []
        },
        mounted: function() {
            // this is making a request to the server so the server can talk to the db
            axios.get("/home").then(function(res) {
                app.images = res.data;
            });
        }
    });
})();
