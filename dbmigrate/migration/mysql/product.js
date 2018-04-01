let mysql = require('mysql'),
mysqlAuth = require('../../config/mysqlAuth')
let pool = mysql.createPool({
    connectionLimit: 10,
    host: mysqlAuth.host,
    user: mysqlAuth.user,
    password: mysqlAuth.password,
    database: 'dwdbmigratemongo',
    port: mysqlAuth.port
});

let migrate = () => {
    pool.query('SELECT * FROM datawarehouse.Products',(err,products) => {
        if(err){
            console.log(err)
        }else{
            pool.query('')
        }
    })
}

module.exports = {
    migrate:migrate
}