var express = require("express");
var router = express.Router({ mergeParams: true });
var User = require("../models/user"),
    Book = require("../models/book");



// router.use(function (req, res, next) {
//     res.locals.currentUser = req.user;
//     currUsr = res.locals.currentUser;
//     //if logged in then this: else currentUser isequals undefined
//     if (currUsr != undefined) {
//         //store currentUser in temp_user
//         temp_user = currUsr.username;
//         // temp_user = currUsr.username;
//         // temp_user2    = window.temp_user;
//     }
//     next();
// })


// User profile


var findBook = function findBook(req, res) {
    // Book.find({'owner.username':req.user.username}).exec(function(err, foundBook){
    Book.find({ 'owner.username': req.params.id }).sort({ createdAt: -1 }).exec(function (err, foundBook) {
        if (err) {
            console.log(err)
        } else {
            //pass found book and requested username
            res.render("users/show", { books: foundBook, usr: req.params.id })
        }
    })
}

router.get("/user/:id", findBook);


router.get("/user/:id/profile", checkProfileOwnership, function (req, res) {
    User.findOne({ "username": req.params.id }, function (err, foundUname) {
        if (err) {
            console.log(err)
            req.flash("error", "Error. Please try again")
            res.redirect("/books")
        } else {
            if (foundUname.email) {
                res.render("users/profile", { emailGiven: true,user:foundUname });
            } else {
                res.render("users/profile", { emailGiven: false,user:foundUname });
            }
        }
    })
    // res.render("users/profile");
})

router.put("/user/:id", function (req, res) {
    User.findOneAndUpdate({ username: req.params.id }, req.body.user).exec(function (err, founduser) {
        if (err) {
            console.log(err)
            req.flash("error", "User not found.")
            res.redirect("/books")
        } else {
            res.redirect("/books")
        }
    })
})

//isLogin middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkProfileOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.params.id == req.user.username) {
            next();
        } else {
            console.log("please login")
        }
    } else {
        res.redirect("back")
    }
}

module.exports = router;