//all imports
const express = require('express');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const User = require('./../models/user');

//enironment variables
require('dotenv').config();

//setting up the email transporter
//beeph - account
//password - as always
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: `${process.env.SECRET_API}`
    }
}));

//all controllers

// / => GET
exports.getLogin = (req, res, next) => {
    //query param
    const inputStatus = req.query.input;
    //if input was incorrect
    let fieldCorrect = true;
    if (inputStatus == 'incorrect') {
        fieldCorrect = false;
    }
    res.render('welcome/index.ejs', {
        pageTitle: "Beeph | Login",
        fieldCorrect: fieldCorrect
    });
}

// /register => GET
exports.getRegister = (req, res, next) => {
    res.render('welcome/register.ejs', {
        pageTitle: "Sign Up",
        inputError: false
    });
}

// /register => POST
exports.postRegister = (req, res, next) => {
    //checking if email is amherst email 
    // or if it already was used    
    const email = req.body.emailInput;

    let emailDoesExist = false;
    User.findByEmail(email)
    .then(result => {
        if (result) {
            emailDoesExist = true;
        }
        return result;
    })
    .then(result => {
        if((email.split('@')[1] != 'amherst.edu') || (emailDoesExist == true)) {
            req.method = 'GET';
            res.render('welcome/register.ejs', {
                pageTitle: "Sign Up",
                inputError: true
            });
        }
        else {
            //checking if password are the same
            if(req.body.passwordInput == req.body.passwordInputRepeat) {
                const password = req.body.passwordInput;
                const name = req.body.userName;
                const surname = req.body.userSurname;

                let randomCode = Math.floor(Math.random() * 10000000000); 
                return transporter.sendMail({
                    to: email,
                    from: 'beephamherst@gmail.com',
                    subject: 'BEEPH Verification Code',
                    html: `Your Code Is: <h1>${randomCode}</h1>`
                })
                .then(result => {
                    req.method = 'GET';
                    res.render('welcome/emailVerify.ejs', {
                        code: randomCode,
                        pageTitle: "Verify Email",
                        email: email,
                        password: password,
                        name: name,
                        surname: surname
                    })
                })
                .catch(err => {
                    console.log('COULD NOT SEND EMAIL');
                });
            }
            else {
                req.method = 'GET';
                res.render('welcome/register.ejs', {
                    pageTitle: "Sign Up",
                    inputError: true
                });
            }
        }
    })
}

// /email-verify => POST
exports.postEmailVerify = (req, res, next) => {
    const verificationCode = req.body.code;
    const enteredCode = req.body.verifyCode;
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    //creating a new user
    if(enteredCode == verificationCode) {
        const registeredUser = new User(email, password, name, surname);
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