const client = require('mariasql'),
    multer = require('multer'),
    jimp = require('jimp'),
    uuid = require('uuid'),
    mysqlAuth = require('../config/mysqlAuth')

const productMiddleware = {}
const c = new client({
    host: mysqlAuth.mysqlAuth.host,
    user: mysqlAuth.mysqlAuth.user,
    password: mysqlAuth.mysqlAuth.password,
    port: mysqlAuth.mysqlAuth.port,
    db: mysqlAuth.mysqlAuth.db
})
var multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        var isPhoto = file.mimetype.startsWith("image/")
        if (isPhoto) {
            next(null, true)
        } else {
            // req.flash("error", "File type not allowed")
        }
    }
}
var upload = multer(multerOptions)

function resize(req, res, next) {
    if (!req.file) {
        next()
    } else {
        var extension = req.file.mimetype.split('/')[1]
        req.body.photo = uuid.v4() + "." + extension
        // fs.mkdir("images/" + temp_user)
        // console.log(req.body.photo)
        // var photo = jimp.read(req.file.buffer)
        // console.log(photo)
        jimp.read(req.file.buffer, function (err, image) {
            image.resize(600, jimp.AUTO)
            image.write("images/" + req.body.photo)
        })

        // photo.resize(600, jimp.AUTO)
        next()
    }
}


productMiddleware.getAllProducts = (req, res) => {
    let page
    if (req.query.page == null) {
        page = 1
    } else {
        page = req.query.page
    }
    let category = req.query.cat
    productsInOnePage = 9
    let startNum = parseInt((page - 1) * productsInOnePage)

    let query
    let countQuery
    if (category) {
        query= `select * from products AS P join categories AS C `+
        `ON P.category_id = C.id where isDeleted = FALSE AND ( C.id = ${category} OR C.parent_Id = ${category})`+
        ` order by createdAt desc limit ${startNum} , 9`;
        countQuery = `select count(*) as c from products join categories on products.category_id = categories.id where isDeleted = false AND ( categories.id = ${category} OR categories.parent_Id = ${category})`;
    } else {
        query = `select * from products where isDeleted = FALSE order by createdAt desc limit ${startNum} , 9`;
        countQuery = `select count(*) as c from products where isDeleted = false`
    }



    c.query(query, (err, products) => {
        if (err) {
            console.log(err)
        } else {
            c.query(countQuery, (err, totalProducts) => {
                if (err) {
                    console.log(err)
                } else {
                    c.query('select C.name AS cname,C.parent_id AS cparent,C2.name AS parentName,C.id AS ID' +
                        ' from categories AS C left join categories AS C2 ON C.parent_id = C2.id', (err, categories) => {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(categories)
                                let count = totalProducts[0].c
                                let pages = Math.floor(count / productsInOnePage + 1)
                                console.log(pages)
                                res.render("products/index", {
                                    products: products,
                                    page: page,
                                    pages: pages,
                                    categories: categories,
                                    category: category
                                })
                            }
                        })
                }
            })
        }
    })
}

productMiddleware.getNewProductForm = (req, res) => {
    c.query('select * from categories',(err,categories)=> {
        if(err){
            console.log(err)
        }else{
            console.log(categories)
            res.render("products/new",{categories:categories})
        }
    })
}

productMiddleware.addNewProduct = (req, res) => {
    c.query("insert into products (name,price,image,category_id) values (:name,:price,:image,:category_id)", {
        name: req.body.name,
        price: req.body.price,
        image: req.body.photo,
        category_id:req.body.category
    }, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            console.log(req.body)
            res.redirect("/")
        }
    })
}

productMiddleware.getProduct = (req, res) => {
    console.log(req.params.id)
    let product_id = req.params.id

    c.query('select * from products where id=:id', {
        id: product_id
    }, (err, foundProduct) => {
        if (err) {
            console.log(err)
        } else {
            console.log(foundProduct)
            res.render('products/show', {
                product: foundProduct
            })

        }
    })
}


c.end()

module.exports = productMiddleware