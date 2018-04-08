let product = require('../models/product'),
order = require('../models/order'),
mysql = require('mysql'),
mysqlAuth = require('../config/mysqlAuth')
let pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlAuth.host,
    user: mysqlAuth.user,
    password: 'kunal',
    database: 'dwsite1',
    port: mysqlAuth.port
});

let migrate = () => {
    pool.query('SELECT *,date(createdAt) AS date FROM Orders AS O JOIN User_addr AS UA ON O.addr_id = UA.id',(err,orders) => {
        if(err){
            console.log(err)
        }else{
            orders.forEach((order) => {
                let addressId = order.addr_id;
                let date = order.date;
                let time = order.createdAt;
                let amount = order.amount;
                let id = order.id;
                let city = order.city
                let state = order.state
                pool.query('INSERT IGNORE INTO dwwarehouse.FactTable(date,time,addressId,city,state,amount,orderId) VALUES(?,?,?,?,?,?,?)',
                [date,time,addressId,city,state,amount,id],(err,fact)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(fact)
                    }
                })
            })
        }
    })
}

module.exports = {
    migrate:migrate
}