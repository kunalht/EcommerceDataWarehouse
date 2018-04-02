let product = require('../models/product'),
order = require('../models/order'),
mysql = require('mysql'),
mysqlAuth = require('../config/mysqlAuth')
let pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlAuth.host,
    user: mysqlAuth.user,
    password: mysqlAuth.password,
    database: 'dwdbmigratemongo',
    port: mysqlAuth.port
});

let migrate = () => {
    
}

module.exports = {
    migrate:migrate
}