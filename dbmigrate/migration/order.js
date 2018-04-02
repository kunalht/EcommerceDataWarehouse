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
    product.find({},(err,allProducts) => {
        if(err){
            console.log(err)
        }else{
            order.find({},(err,allOrders)=> {
                if(err){
                    console.log(err)
                }else{
                    allOrders.forEach((order)=> {
                        // console.log(order)
                        let productMongoId = order.products.id.toString();
                        pool.query('SELECT id FROM Products WHERE mongoId=?',[productMongoId], (err,productId)=> {
                            if(err){
                                console.log(err)
                            }else{
                                let address = order.address
                                let createdAt = order.createdAt
                                let city = order.city
                                let state = order.state
                                let mongoID = order._id.toString();
                                pool.query('INSERT IGNORE INTO Orders(address,createdAt,city,state,mongoId) VALUES(?,?,?,?,?)',[address,createdAt,city,state,mongoID],(err,newOrder)=>{
                                    //Add into order Items
                                    if(err){
                                        console.log(err)
                                    }else{
                                        if(newOrder.insertId){
                                            let orderMySQLId = newOrder.insertId;
                                            let productMySQLId = productId[0].id
                                            pool.query('INSERT INTO Order_items(order_id,item_id,quantity) VALUES(?,?,?)',
                                            [orderMySQLId,productMySQLId,1],(err,newOrderItem) => {
                                                if(err){
                                                    console.log(err)
                                                }else{
                                                    console.log(newOrderItem)
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    })
                    // console.log(allOrders)
                }
            })
        }
    })
}

module.exports = {
    migrate:migrate
}