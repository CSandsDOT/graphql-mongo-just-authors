const mongoose = require('mongoose')

const BookSchema = new mongoose.Schema({
    title: String,
    description: String,
    authorId: String
})

const Book = mongoose.model("Book", BookSchema, "books")
module.exports = Book