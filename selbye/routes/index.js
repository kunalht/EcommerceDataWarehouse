var express = require("express");
var router = express.Router();
var passport = require("passport"),
    geoLocator = require("geolocator"),
    FacebookStrategy = require("passport-facebook"),
    GoogleStrategy = require("passport-google-oauth");
var User = require("../models/user"),
    Book = require("../models/book");
var configAuth = require('../config/auth');


// var city, address
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    currUsr = res.locals.currentUser;
    currentCity = req.cookies.city
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    //if logged in then this: else currentUser isequals undefined
    if (currUsr != undefined) {
        //store currentUser in temp_user
        temp_user = currUsr.username;
        // temp_user = currUsr.username;
        // temp_user2    = window.temp_user;
    }
    next();
})

function checkIfRegistered() {

}
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

router.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login', session: true }),
    function (req, res) {
        if (req.user.username != null) {
            res.redirect('back');
        } else {
            res.redirect("/username")
        }
    })

router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/login/google/return', passport.authenticate('google', { failureRedirect: '/login', session: true }),
    function (req, res) {
        if (req.user.username != null) {
            res.redirect("back");
        } else {
            res.redirect("/username")
        }
    })

//Socket test
// router.get("/socket", function (req, res) {
//     res.render("socket")
// })

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

//AUTHENTICATION ROUTES
// router.get("/register", function (req, res) {
//     res.render("register.ejs")
// })
//sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/books")
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/user/"+req.body.username+"/profile");
        })
    })
})

//Login 
// router.get("/login", function (req, res) {
//     res.render("login");
// })

router.post('/login',
    passport.authenticate('local', {
        successRedirect: 'back',
        failureRedirect: '/books',
        failureFlash: true
    })
);
// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "back",
//         filureRedirect: "/login"
//     }), function (req, res) {
//     })

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out")
    res.redirect("/books");
})

router.get("/username", function (req, res) {
    res.render("users/uname", { doesExist: false })
})

//Add username of user logged in with facebook ID
//username = received from input
//res.locals.currentUser.facebook.id is current facebook ID
router.put("/username", function (req, res) {
    User.find({ "username": req.body.username }, function (err, foundUser) {
        if (err) {
            console.log(err)
            req.flash("error", "Error occurred.Please try again.")
        } else {
            if (foundUser.length > 0) {
                res.render("users/uname", { doesExist: true })
            } else {
                if (req.user.facebook == null) {
                    User.findOneAndUpdate({ 'google.id': res.locals.currentUser.google.id }, { 'username': req.body.username }).exec(function (err, founduser) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.redirect("/books")
                        }
                    })
                } else if (req.user.google == null) {
                    User.findOneAndUpdate({ 'facebook.id': res.locals.currentUser.facebook.id }, { 'username': req.body.username }).exec(function (err, founduser) {
                        if (err) {
                            console.log(err)
                        } else {
                            res.redirect("/books")
                        }
                    })
                }
            }
        }
    })


})
router.post("/location", function (req, res) {
    //store city in location var
    if (req.body.city_list) {
        city = req.body.city_list
    } else {
        city = req.body.city
        address = req.body.address
    }
    res.cookie('city', city)
    res.redirect("back")
})

router.get("/message/:id", function (req, res) {
    res.render("users/message", { uname: req.params.id })
})
router.post("/message", function (req, res) {
    user = req.body.uname
    msg = req.body.msg
    User.find({ "username": user }, function (err, founduser) {
        if (err) {
            console.log(err)
        } else {
            email = founduser[0].email
            if (req.user) {
                fromUser = req.user.username

                if (email) {
                    var subject = "New message from" + fromUser
                    var msg = "You have a new Message from " + fromUser + "\n\n" + msg + "\n\n" +
                        "Please do not reply to this email. This is an auto generated email." +
                        "\n To reply back to sender go to this link:" + "http://selbye.com/message" + fromUser
                    // sendgrid email send
                    var helper = require('sendgrid').mail;
                    var fromEmail = new helper.Email('no-reply@selbye.com');
                    var toEmail = new helper.Email(email);
                    var subject = subject;
                    var content = new helper.Content('text/plain', msg);
                    var mail = new helper.Mail(fromEmail, subject, toEmail, content);

                    var sg = require('sendgrid')(configAuth.sendgridAuth.api);
                    var request = sg.emptyRequest({
                        method: 'POST',
                        path: '/v3/mail/send',
                        body: mail.toJSON()
                    });
                    sg.API(request, function (error, response) {
                        if (error) {
                            console.log('Error response received');
                        }
                    });
                    res.redirect("back")
                }
                else {
                    console.log("User has not specified his email ID sorry!")
                }
            } else {
                console.log("Please login first")
            }
        }
    })
})
module.exports = router;