var express = require("express");
var router = express.Router();
var fs = require("file-system"),
    multer = require('multer')
var User = require("../models/user"),
    Category = require("../models/categories"),
    Book = require("../models/book"),
    Product = require("../models/product"),
    Order = require("../models/order"),
    jimp = require('jimp')
uuid = require('uuid')

var multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        var isPhoto = file.mimetype.startsWith("image/")
        if (isPhoto) {
            next(null, true)
        } else {
            req.flash("error", "File type not allowed")
        }
    }
}
var upload = multer(multerOptions)

function resize(req, res, next) {
    if (!req.file) {
        next()
    } else {
        var extension = req.file.mimetype.split('/')[1]
        req.body.photo =uuid.v4() + "." + extension
        fs.mkdir("images/" + temp_user)
        // console.log(req.body.photo)
        // var photo = jimp.read(req.file.buffer)
        // console.log(photo)
        jimp.read(req.file.buffer, function (err, image) {
            // image.resize(600, jimp.AUTO)
            image.resize(620, 600)
            image.write("images/" + temp_user+"/"+ req.body.photo)
        })

        // photo.resize(600, jimp.AUTO)
        next()
    }
}

router.get("/", function (req, res) {
    //res.send("success")
    res.redirect("/books")
})


//Add new book
router.get("/books/new", isLoggedIn, function (req, res) {
    Category.find({}, function (err, allCats) {
        if (err) {
            console.log(err)
        } else {
            res.render("books/new.ejs", { categories: allCats });
        }

    })

})
// //Check if file already exists
// fs.readdir('images/', (err, files) => {
//     files.forEach(file => {
//         console.log(file);
//     });
// })

//CREATE BOOK logic
//upload.single will add new photo
router.post("/books", isLoggedIn, upload.single('photo'), resize, function (req, res, next) {
    var name = req.body.name,
        price = req.body.price,
        desc = req.body.desc

    // Owner array contains username and userID
    var owner = {
        id: req.user._id,
        username: req.user.username,
    }
    category = [
        req.body.category,
        req.body.subCategory
    ]
    try {
        //image path from /images/username/filename directory
        var image = ("/"+ temp_user +"/"+ req.body.photo);
        var newProduct = {
            name: name, price: price, desc: desc, image: image,
         owner: owner
        }
    } catch (err) {
        var newProduct = {
            name: name, price: price, desc: desc,
         owner: owner
        }
    }

    Product.create(newProduct, function (err, newlyCreated) {
        if (err) {
            console.log(err)
            req.flash("error", "Error occurred. Please try again.")
        } else {
            res.redirect("/books")
        }
    })
})


router.get("/books/:id/edit", checkBookOwnership, function (req, res) {
    Book.findById({ "_id": req.params.id }, function (err, foundBook) {
        res.render("books/edit.ejs", { book: foundBook })
    })
})
// Update book info
router.put("/books/:id", checkBookOwnership, function (req, res) {
    Book.findByIdAndUpdate(req.params.id, req.body.book, function (err, updatedBook) {
        if (err) {
            console.log(err)
            req.flash("error", "Error occurred.Please try again.")
        } else {
            res.redirect("/books/" + req.params.id)
        }
    })
})

router.delete("/books/:id", checkBookOwnership, function (req, res) {
    Book.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            req.flash("success", "Book deleted")
            res.redirect("/books")
        }
    })
})

//Show page AKA book page
router.get("/books/:id", function (req, res) {
    Product.findById(req.params.id).exec(function (err, foundBook) {
        if (err) {
            console.log(err)
            req.flash("error", "Error")
        } else {
            res.render("books/show.ejs", { books: foundBook });
        }
    })
})
//Show page
//List of all books AKA home page
router.get("/books", function (req, res) {
    cat = req.query.cat
    page = req.query.page
    query = req.query.q
    Product.find().sort({ createdAt: -1 }).exec(function (err, allBooks) {
        if (err) {
            console.log(err)
        } else {
            res.render("books/index", { books: allBooks});
        }
    })
})

router.get("/books/:id/order", function(req, res) {
    //Show form
    var bookId = req.params.id
    res.render("books/newOrder",{bookId: bookId})
})

router.post("/books/:id/order", function(req, res){
    var newOrder = {
        fullName: req.body.name,
        address: req.body.address,
        products: {
            id: req.params.id
        }
    }
    Order.create(newOrder,function(err,newOrder){
        if(err){
            console.log(err)
        }else{
            console.log(newOrder);
        }
    })
})

router.post("/search", function (req, res) {
    query = req.body.query
    res.redirect("/books?q=" + query)
})
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please Login first")
    res.redirect("/books")
}

function checkBookOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Book.findById(req.params.id, function (err, foundBook) {
            if (err) {
                req.flash("error", "Error occurred.Please try again.")
                res.redirect("/books")
            } else {
                //Does user owns the Book?
                if (foundBook.owner.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Error ")
                    res.redirect("/books");
                }
            }
        })
    } else {
        req.flash("error", "Please login first.")
        res.redirect("/books")
    }
}



module.exports = router;