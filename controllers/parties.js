const mongodb = require('mongodb');
const User = require('./../models/user');
const Party = require('./../models/parties');


// /parties/all-parties => GET
exports.getAllParties = (req, res, next) => {
    const queryEmail = req.query.email;
    const queryPassword = req.query.pass;
    return User.hasAccess(queryEmail, queryPassword)
    .then(access => {
        if (access) {
            return User.findByEmail(queryEmail)
            .then(user => {
                return Party.fetchAll()
                .then(parties => {
                    res.render('parties/all-parties.ejs', {
                        user: user,
                        parties: parties,
                        pageTitle: `All Parties`
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

// /parties/add-party => POST 
exports.postAddParty = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const partyName = req.body.partyNameInput;
    const place = req.body.placeInput;
    const time = req.body.timeInput;
    const date = req.body.dateInput;
    const description = req.body.descriptionInput;
    
    return User.findByEmail(email)
    .then(user => {
        const addedParty = new Party(partyName, place, time, date, description, user);
        res.redirect(`/parties/all-parties?email=${email}&pass=${password}`);
        return addedParty.save();
    });
}

// /parties/add-attendant => POST 
exports.postAddAttendant = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const partyId = req.body.partyIdInput;

    return Party.addAttendant(email, partyId)
    .then(result => {
        res.redirect(`/parties/all-parties?email=${email}&pass=${password}`);
    })
    .catch(err => {
        throw err;
    })
}

// /parties/delete-party
exports.postDeleteParty = (req, res, next) => {
    const email = req.query.email;
    const password = req.query.pass;
    const partyId = req.body.partyIdInput;
    res.redirect(`/parties/all-parties?email=${email}&pass=${password}`);
    return Party.delete(partyId);
}