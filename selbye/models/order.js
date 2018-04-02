var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    orderBy: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        email: String,
        fullName: String,
        address: String,
        amount: Number,
    },
    products: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    fullName: String,
    city: String,
    state: String,
    address: String
})

module.exports = mongoose.model("Order", orderSchema);