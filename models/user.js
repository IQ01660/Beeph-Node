const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

class User {
    constructor(email, password, name, surname, id) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this._id = id;
    }
    
    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
        .then(result => {
            return result;
        })
        .catch(err => {
            console.log('UNABLE TO CREATE THE USER');
        });
    }

    static findByEmail(_email) {
        const db = getDb();
        return db.collection('users').findOne({email: _email});
    }
}

module.exports = User;