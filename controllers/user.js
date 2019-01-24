const express = require('express');
const User = require('./../models/user');


// /user/my-beeph => GET
exports.getMyBeeph = (req, res, next) => {
    const queryEmail = req.query.email;
    const queryPassword = req.query.pass;
    return User.hasAccess(queryEmail, queryPassword)
    .then(access => {
        if (access) {
            return User.findByEmail(queryEmail)
            .then(user => {
                res.render('user/my-beeph.ejs', {
                    user: user,
                    pageTitle: `Welcome ${user.name}`
                })
            })
            .catch(err => {
                throw err;
            });
            
        }
        else {
            res.redirect('/doesnotexist');
        }
    });
}

// /user/my-beeph => POST
exports.postMyBeeph = (req, res, next) => {
    const enteredEmail = req.body.emailInput;
    const enteredPass = req.body.passwordInput;
    return User.hasAccess(enteredEmail, enteredPass)
    .then(access => {
        if (access) {
            return User.findByEmail(enteredEmail)
            .then(user => {
                res.render('user/my-beeph.ejs', {
                    user: user,
                    pageTitle: `Welcome ${user.name}`
                })
            })
            .catch(err => {
                throw err;
            });
            
        }
        else {
            res.redirect('/?input=incorrect');
        }
    });
}

// /user/my-beeph/save-about-me => POST
exports.postMyBeephAboutMe = (req, res, next) => {
    const updatedAbout = req.body.aboutMeInput;
    const email = req.query.email;
    const password = req.query.pass;
    return User.findByEmail(email)
    .then(user => {
        const updatedUser = new User(
            user.email,
            user.password,
            user.name,
            user.surname,
            user.aboutMe
        );
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
        return updatedUser.updateAboutMe(updatedAbout);
    })
    .catch(err => {
        throw err;
    })
}

// /user/my-beeph/save-rel-status => POST
exports.postMyBeephRelStatus = (req, res, next) => {
    const updatedStatus = req.body.relationshipStatusInput;
    const email = req.query.email;
    const password = req.query.pass;
    return User.findByEmail(email)
    .then(user => {
        const updatedUser = new User(
            user.email,
            user.password,
            user.name,
            user.surname,
            user.aboutMe,
            user.relationshipStatus
        );
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
        return updatedUser.updateRelStatus(updatedStatus);
    })
    .catch(err => {
        throw err;
    })
}