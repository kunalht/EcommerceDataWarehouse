var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    name: String,
    price: String,
    desc: String,
    image: String,
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

module.exports = mongoose.model("Product", productSchema);