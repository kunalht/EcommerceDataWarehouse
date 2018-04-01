var express = require("express");
var router = express.Router();
var fs = require("file-system"),
    multer = require('multer')
var User = require("../models/user"),
    Category = require("../models/categories"),
    Book = require("../models/book"),
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
        desc = req.body.desc,
        ISBN = req.body.ISBN,
        language = req.body.language,
        author = req.body.author,
        publisher = req.body.publisher,
        pages = req.body.pages,
        city = req.body.city,
        locality = req.body.locality

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
        var newBook = {
            name: name, price: price, desc: desc, image: image,
            pages: pages, author: author, publisher: publisher, ISBN: ISBN, city: city, locality: locality, owner: owner, category: category
        }
    } catch (err) {
        var newBook = {
            name: name, price: price, desc: desc,
            pages: pages, author: author, publisher: publisher, ISBN: ISBN, city: city, locality: locality, owner: owner, category: category
        }
    }

    Book.create(newBook, function (err, newlyCreated) {
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

//SHOW page AKA book page
router.get("/books/:id", function (req, res) {
    Book.findById(req.params.id).exec(function (err, foundBook) {
        if (err) {
            console.log(err)
            req.flash("error", "Error")
        } else {
            User.findOne({ "username": foundBook.owner.username }, function (err, foundUser) {
                if (err) {
                    console.log(err)
                } else {
                    res.render("books/show.ejs", { books: foundBook, user: foundUser });
                }
            })
        }
    })
})
//Show page
//List of all books AKA home page
router.get("/books", function (req, res) {
    cat = req.query.cat
    page = req.query.page
    query = req.query.q
    if (!page) {
        page == 1
    }
    min = (page - 1) * 12
    if (query) {
        if (req.cookies.city) {
            Book.find({ $and: [{ city: req.cookies.city }, { "name": { $regex: ".*" + query + ".*", $options: "i" } }] }).sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                if (err) {
                    console.log(err)
                } else {
                    Book.find({ $and: [{ city: req.cookies.city }, { "name": { $regex: ".*" + query + ".*", $options: "i" } }] }, function (err, booksFound) {
                        res.render("books/index", { books: allBooks, categories: null, totalBooks: booksFound.length, page: page, currentCategory: null, query: query });
                    })
                }
            })
        } else {
            Book.find({ "name": { $regex: ".*" + query + ".*", $options: "i" } }).sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                if (err) {
                    console.log(err)
                } else {
                    Book.find({ "name": { $regex: ".*" + query + ".*", $options: "i" } }, function (err, booksFound) {
                        var totalBooks = booksFound.length
                        res.render("books/index", { books: allBooks, categories: null, totalBooks: totalBooks, page: page, currentCategory: null, query: query });
                    })
                }
            })
        }
    } else {
        if (req.cookies.city) {
            if (cat) {
                Book.find({ $and: [{ city: req.cookies.city }, { category: cat }] }).sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                    if (err) {
                        console.log(err)
                    } else {
                        reg = "," + cat
                        Category.find({ "path": { $regex: ".*" + reg + ".$" } }, function (err, allCats) {
                            if (err) {
                                console.log(err)
                            } else {
                                Book.find({ $and: [{ city: req.cookies.city }, { category: cat }] }, function (err, booksFound) {
                                    res.render("books/index", { books: allBooks, categories: allCats, totalBooks: booksFound.length, page: page, currentCategory: cat });
                                })
                            }
                        })
                    }
                })
            } else {
                Book.find({ city: req.cookies.city }).sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                    if (err) {
                        console.log(err)
                    } else {
                        reg = ",books"
                        Category.find({ "path": { $regex: ".*" + reg + ".$" } }, function (err, allCats) {
                            if (err) {
                                console.log(err)
                            } else {
                                Book.find({ city: req.cookies.city }, function (err, booksFound) {
                                    res.render("books/index", { books: allBooks, categories: allCats, totalBooks: booksFound.length, page: page, currentCategory: null });
                                })
                            }
                        })
                    }
                })
            }
        } else {
            if (cat) {
                Book.find({ category: cat }).sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                    if (err) {
                        console.log(err)
                    } else {
                        reg = "," + cat
                        Category.find({ "path": { $regex: ".*" + reg + ".$" } }, function (err, allCats) {
                            if (err) {
                                console.log(err)
                            } else {
                                Book.find({ category: cat }, function (err, booksFound) {
                                    res.render("books/index", { books: allBooks, categories: allCats, totalBooks: booksFound.length, page: page, currentCategory: cat });
                                })
                            }
                        })
                    }
                })
            } else {
                Book.find().sort({ createdAt: -1 }).skip(min).limit(12).exec(function (err, allBooks) {
                    if (err) {
                        console.log(err)
                    } else {
                        reg = ",books"
                        Category.find({ "path": { $regex: ".*" + reg + ".$" } }, function (err, allCats) {
                            if (err) {
                                console.log(err)
                            } else {
                                Book.find({}, function (err, booksFound) {
                                    var totalBooks = booksFound.length
                                    res.render("books/index", { books: allBooks, categories: allCats, totalBooks: totalBooks, page: page, currentCategory: null });
                                })
                            }
                        })
                    }
                })
            }
        }
    }
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