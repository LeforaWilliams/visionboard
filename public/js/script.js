(function() {
    Vue.component("modal", {
        // Vue components have no el to specifx to work with
        //data has to be a function here otherwise it will affect al of them at once
        data: function() {
            return {
                image: {}
            };
        },
        mounted: function() {
            var modal = this;
            axios.get("/image/" + this.id).then(function(res) {
                if (!res.data) {
                    modal.hideModal();
                } else {
                    modal.image = res.data;
                }
            });
        },
        props: ["id"],
        template: "#modal-template",
        methods: {
            hideModal: function() {
                this.$emit("close");
            }
        },
        watch: {
            // NEED TO GO OVER THIS KID AGAIN
            id: function() {
                var modal = this;
                axios.get("/image/" + this.id).then(function(res) {
                    modal.image = res.data;
                    if (!res.data) {
                        modal.hideModal();
                    } else {
                        modal.image = res.data;
                    }
                });
            }
        }
    });

    Vue.component("comments", {
        data: function() {
            return {
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },
        props: ["id"],
        template: "#comments-template",
        mounted: function() {
            var component = this;
            axios.get("/comments/" + this.id).then(function(res) {
                component.comments = res.data;
            });
        },
        methods: {
            saveComment: function(e) {
                e.preventDefault();
                var component = this;
                axios
                    .post("/comments/" + this.id, this.form)
                    .then(function(res) {
                        component.comments.unshift(res.data[0]);
                    });
            }
        },
        watch: {
            id: function() {
                var component = this;
                axios.get("/comments/" + this.id).then(function(res) {
                    component.comments = res.data;
                });
            }
        }
    });

    var app = new Vue({
        el: ".imageboard-wrap",
        data: {
            images: [],
            form: {
                title: "",
                username: "",
                description: ""
            },
            show: location.hash.length > 1 && location.hash.slice(1),
            moreImages: true,
            lastDataId: null
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data.images;
                app.lastDataId = res.data.id;
            });
            addEventListener("hashchange", function() {
                app.show = location.hash.slice(1);
            });
        },

        methods: {
            showMore: function() {
                var lastid = this.images[this.images.length - 1].id;
                axios.get("/get-more-images/" + lastid).then(function(res) {
                    app.lastDataId = res.data.id;
                    for (var i = 0; i < res.data.images.length; i++) {
                        app.images.push(res.data.images[i]);
                    }
                    // if (app.lastId == lastid) {
                    //     app.moreImages = false;
                    // }
                });
            },
            hide: function() {
                this.show = null;
                location.hash = "";
            },
            showImage: function(imageSerialId) {
                this.show = imageSerialId;
            },
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
                    app.images.pop();
                    app.form.title = "";
                    app.form.username = "";
                    app.form.description = "";
                    file = "";
                });
            } //UPLOADFILE FUNTION END
        } // METHODS END
    }); // VUE APP END
})(); //IIFE END
