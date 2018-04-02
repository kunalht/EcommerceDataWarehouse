var mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    _id: String,
    path: String
})

module.exports = mongoose.model("Category", categorySchema);