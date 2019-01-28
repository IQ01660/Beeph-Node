const express = require('express');
const User = require('./../models/user');


// /students/student-search => GET
exports.getStudentSearch = (req, res, next) => {
    const queryEmail = req.query.email;
    const queryPassword = req.query.pass;
    return User.hasAccess(queryEmail, queryPassword)
    .then(access => {
        if (access) {
            return User.findByEmail(queryEmail)
            .then(user => {
                res.render('students/student-search.ejs', {
                    user: user,
                    searchedUsers: [],
                    pageTitle: 'Student Search',
                    method: 'GET'
                })
            })
        }
        else {
            res.redirect('/doesnotexist');
        }
    });
}

// /students/student-search => POST
exports.postStudentSearch = (req, res, next) => {
    const searchName = req.body.nameInput;
    const searchSurname = req.body.surnameInput;
    const queryEmail = req.query.email;
    const queryPassword = req.query.pass;
    return User.findByEmail(queryEmail)
    .then(user => {
        return User.fetchAll()
        .then(users => {
            //the filtering function
            function findSearched(user) {
                if(user.name == searchName || user.surname == searchSurname) {
                    return true;
                }
                return false
            }
            const searchedUsers = users.filter(findSearched);
            res.render('students/student-search', {
                user: user,
                searchedUsers:searchedUsers,
                pageTitle: 'Student Search | Results',
                method: 'POST'
            })
        })
    });
}