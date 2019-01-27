const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;
const User = require('./user');

class Party {
    constructor(name, place, time, date, descr, organizer) {
        this.name = name;
        this.place = place;
        this.time = time;
        this.date = date;
        this.desctiption = descr;
        this.participants = 0;
        this.organizer = organizer;
        this.attendants = [];
    }

    save() {
        const db = getDb();
        return db.collection('parties').insertOne(this);
    }

    static delete(id) {
        const db = getDb();
        return db.collection('parties').deleteOne( {_id: new mongodb.ObjectId(id)});
    }

    static addAttendant(email, id) {
        let isAttendant = false;

        const db = getDb();
        return Party.findById(id)
        .then(party => {
            
            for(let i = 0; i < party.attendants.length; i++) {
                if (party.attendants[i].email == email) {
                    isAttendant = true;
                }
            }
            return party;
        })
        .then(party => {
            User.findByEmail(email)
            .then(user => {
                if (isAttendant == false) {
                    party.attendants.push(user);
                    party.participants++;
                    return db.collection('parties').updateOne({_id: new mongodb.ObjectId(party._id)}, {$set: party});
                }
            })
        })
    }

    static findById(id) {
        const db = getDb();
        return db.collection('parties').findOne({_id: new mongodb.ObjectId(id)});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('parties').find().toArray();
    }
}

module.exports = Party;