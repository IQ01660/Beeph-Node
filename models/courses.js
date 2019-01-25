const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

class Course {
    constructor(name, semester, year, id) {
        this.name = name;
        this.semester = semester;
        this.year = year;
        this._id = id
    }

    save() {
        const db = getDb();
        return db.collection('courses').insertOne(this)
    }

    delete() {
        const db = getDb();
        return db.collection('courses').deleteOne({_id: new mongodb.ObjectId(this._id)})
    }

    static findById(id) {
        const db = getDb();
        return db.collection('courses').findOne({_id: new mongodb.ObjectId(id)});
    }

    static findByName(_name) {
        const db = getDb();
        return db.collection('courses').findOne({name: _name});
    }
}

module.exports = Course;