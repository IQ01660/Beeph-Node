//all built in imports
const express = require('express');

//importing the controllers
const welcomeControllers = require('./../controllers/welcome');

//creating the router
const router = express.Router();

//all welcome routes

// / => GET
router.get('/', welcomeControllers.getLogin);

// /register => GET
router.get('/register', welcomeControllers.getRegister);

// /register => POST
router.post('/register', welcomeControllers.postRegister);

// /email-verify => POST
router.post('/email-verify', welcomeControllers.postEmailVerify);

// /forgot-pass => GET
router.get('/forgot-pass', welcomeControllers.getForgotPass);

// /forgot-pass => POST
router.post('/forgot-pass', welcomeControllers.postForgotPass);

//the router export
module.exports = router;