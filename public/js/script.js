(function() {
    var app = new Vue({
        el: ".imageboard-wrap",
        data: {
            images: [],
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            // this is making a request to the server so the server can talk to the db
            axios.get("/home").then(function(res) {
                app.images = res.data;
            });
        },

        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                // console.log("vue instance", this.form);
                var file = $('input[type="file"]').get(0).files[0];
                console.log("Uploaded file", file);

                // We use form data to send files to the server
                var formData = new FormData();
                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(res) {
                    console.log("Response in Post /upload in script.js: ", res);
                    app.images.unshift(res.data[0]);
                });
            } //UPLOADFILE FUNTION END
        } // METHODS END
    }); // VUE APP END
})(); //IIFE END
