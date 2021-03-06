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

// /user/alien-beeph => GET
exports.getAlienBeeph = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const alienEmail = req.query.alienemail;

    return User.hasAccess(email, password)
    .then(access => {
        if (access) {
            return User.findByEmail(email)
            .then(homeUser => {
                return User.findByEmail(alienEmail)
                .then(alienUser => {
                    res.render('user/alien-beeph.ejs', {
                        user: homeUser,
                        alienUser: alienUser,
                        pageTitle: `Welcome ${homeUser.name}`
                    })
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

// /user/my-beeph/save-about-me => POST
exports.postMyBeephAboutMe = (req, res, next) => {
    const updatedAbout = req.body.aboutMeInput;
    const email = req.query.email;
    const password = req.query.pass;
    return User.findByEmail(email)
    .then(user => {
        console.log(user);
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
            user.surname
        );
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
        return updatedUser.updateRelStatus(updatedStatus);
    })
    .catch(err => {
        throw err;
    })
}

// /user/my-beeph/add-course
exports.postAddMyCourses = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const courseName = req.body.courseNameInput;
    const semester = req.body.semesterInput;
    const year = req.body.yearInput;
    
    return User.addCourse(email, courseName, semester, year)
    .then(result => {
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
    })
    .catch(err => {
        throw err;
    });
}

exports.postDeleteMyCourse = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const courseName = req.body.courseNameInput;

    return User.findByEmail(email)
    .then(user => {
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
        return User.deleteCourse(user, courseName);
    })
    .catch(err => {
        throw err;
    })
}

// /user/my-beeph/upload-avatar
exports.postUploadAvatar = (req, res, next) => {
    const image = req.file;
    const imagePath = image.path;
    const email = req.query.email;
    const password = req.query.pass;
    return User.findByEmail(email)
    .then(user => {
        const updatedUser = new User(
            user.email,
            user.password,
            user.name,
            user.surname
        );
        res.redirect(`/user/my-beeph?email=${email}&pass=${password}`);
        updatedUser.updateProfileImg(imagePath);
    })
}