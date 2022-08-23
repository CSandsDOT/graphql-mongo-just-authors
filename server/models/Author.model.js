const mongoose = require('mongoose')

const AuthorSchema = new mongoose.Schema({
    name: String,
    bio: String
})

const Author = mongoose.model("Author", AuthorSchema, "authors")
module.exports = Author