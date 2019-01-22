//all imports
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('./../models/user');

//enironment variables
require('dotenv').config();

//global user info
let email;
let password;
let name;
let surname;

//setting up the email transporter
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key:`${process.env.SECRET_API}`
    }
}));

//all controllers

// / => GET
exports.getLogin = (req, res, next) => {
    res.render('welcome/index.ejs', {
        pageTitle: "Beeph | Login"
    });
}

// /register => GET
exports.getRegister = (req, res, next) => {
    res.render('welcome/register.ejs', {
        pageTitle: "Sign Up"
    });
}

// /register => POST
exports.postRegister = (req, res, next) => {
    //checking if email is amherst email 
    // or if it already was used    
    email = req.body.emailInput;

    let emailDoesExist = false;
    User.findByEmail(email)
    .then(result => {
        if (result) {
            emailDoesExist = true;
        }
        return result;
    })
    .then(result => {
        if( (email.split('@')[1] != 'amherst.edu') || (emailDoesExist == true)) {
            res.redirect('/register');
        }
        else {
            //checking if password are the same
            if(req.body.passwordInput == req.body.passwordInputRepeat) {
                password = req.body.passwordInput;
                name = req.body.userName;
                surname = req.body.userSurname;

                let randomCode = Math.floor(Math.random() * 10000000000); 

                return transporter.sendMail({
                    to: email,
                    from: 'beephamherst@gmail.com',
                    subject: 'BEEPH Verification Code',
                    html: `Your Code Is: <h1>${randomCode}</h1>`
                })
                .then(result => {
                    res.render('welcome/emailVerify.ejs', {
                        code: randomCode,
                        pageTitle: "Verify Email"
                    })
                })
                .catch(err => {
                    console.log('COULD NOT SEND EMAIL');
                });
            }
            else {
                res.redirect('/register');
            }
        }
    })
}

// /email-verify => POST
exports.postEmailVerify = (req, res, next) => {
    const verificationCode = req.body.code;
    const enteredCode = req.body.verifyCode;
    //creating a new user
    if(enteredCode == verificationCode) {
        const registeredUser = new User(email, password, name, surname);
        email = undefined;
        password = undefined;
        name = undefined;
        surname = undefined;
        registeredUser.save()
        .then(result => {
            res.redirect('/');
        })
        .catch(err => {
            throw err;
        });
    }
    //redirecting to 404
    else {
        res.redirect('/thispagedoesnotexist');
    }
}

// /forgot-pass => GET
exports.getForgotPass = (req, res, next) => {
    res.render('welcome/forgotPass.ejs', {
        pageTitle: 'Forgot Password'
    });
}

// /forgot-pass => GET 
exports.postForgotPass = (req, res, next) => {
    //take the entered email
    const enteredEmail = req.body.emailInput;
    //check if it exists in db
    User.findByEmail(enteredEmail)
    .then(result => {
        if(!result) {
            res.redirect('/doesnotexist');
        }
        else {
            //take the user's password
            const sendingPassword = result.password;
            //send it to the email
            return transporter.sendMail({
                to: enteredEmail,
                from: 'beephamherst@gmail.com',
                subject: 'BEEPH Your Password',
                html: `Your Password Is: <h3>${sendingPassword}</h3>`
            })
            .then(result => {
                res.redirect('/');
            })
            
        }
    })
    .catch(err => {
        throw err;
    })
}