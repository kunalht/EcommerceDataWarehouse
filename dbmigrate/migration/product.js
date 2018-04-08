let product = require('../models/product'),
mysql = require('mysql'),
mysqlAuth = require('../config/mysqlAuth')
let pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlAuth.host,
    user: mysqlAuth.user,
    password: mysqlAuth.password,
    database: 'dwmongo',
    port: mysqlAuth.port
});

let migrate = () => {
    product.find({},(err,allProducts) => {
        if(err){
            console.log(err)
        }else{
            allProducts.forEach((product) => {
                let name = product.name
                let mongoID = product._id.toString()
                let price = product.price
                let desc = product.desc
                let image = product.image
                let createdAt = product.createdAt

                pool.query('INSERT IGNORE INTO Products(name,image,price,description,createdAt,mongoId) VALUES '+
                '(?,?,?,?,?,?)',[name,image,price,desc,createdAt,mongoID],(err,newProduct) => {
                    if(err){
                        console.log(err)
                    }else{
                    }
                })
            })
        }
    })
}

module.exports = {
    migrate:migrate
}