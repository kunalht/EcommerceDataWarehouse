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

// pool.query('SHOW DATABASES',(db) => {
//     console.log(db)
// })

//Migration
//MongoDB to MySQL
let productMigrate = require('./migration/product')
let orderMigrate = require('./migration/order')
let dataWarehouse = require('./dw/warehouse')
//Migration
//MySQL to MySQL

// let myProductMigrate = require('./migration/mysql/product');

productMigrate.migrate();
// orderMigrate.migrate();
// dataWarehouse.migrate();
