var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    name: String,
    price: String,
    desc: String,
    image: String,
    author: String,
    ISBN: String,
    pages: String,
    publisher: String,
    language: String,
    city: String,
    locality: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    category: [
    ]
})

module.exports = mongoose.model("Book", bookSchema);