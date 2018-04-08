var express = require("express");
var app = express();
var mongoose = require("mongoose"),
    mysql = require('mysql'),
    mysqlAuth = require('./config/mysqlAuth')

let pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlAuth.host,
    user: mysqlAuth.user,
    password: mysqlAuth.password,
    database: mysqlAuth.db,
    port: mysqlAuth.port
});

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/ecommerce")

app.set("view engine", "ejs")


//Migration
//MongoDB to MySQL
let productMigrate = require('./migration/product')
let orderMigrate = require('./migration/order')
let dataWarehouse = require('./dw/warehouse')
//Migration
//MySQL to MySQL

// let myProductMigrate = require('./migration/mysql/product');

// productMigrate.migrate();
// orderMigrate.migrate();

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/migrate', (req, res) => {
    productMigrate.migrate();
    orderMigrate.migrate();
    res.redirect('back')
})

app.get('/dataview', (req, res) => {
    dataWarehouse.view();
})

app.get('/warehouse', (req, res) => {
    dataWarehouse.migrate();
    res.redirect('back')
})
app.listen("3005", function () {
    console.log("Migration started")
})