const mongodb = require('mongodb');
const getDb = require('./../util/database').getDb;

class User {
    constructor(email, password, name, surname) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.aboutMe = '';
        this.relationshipStatus = 'Not Specified';
        this.courses = [];
        this.imageUrl = 'img/user.png';
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

    updateAboutMe(_aboutMe) {
        const db = getDb();
        return db.collection('users').updateOne({email: this.email}, {$set : {aboutMe: _aboutMe}});
    }

    updateRelStatus(_status) {
        const db = getDb();
        return db.collection('users').updateOne({email: this.email}, {$set : {relationshipStatus: _status}});
    }

    updateProfileImg(_imgUrl) {
        const db = getDb();
        return db.collection('users').updateOne({email: this.email}, {$set : {imageUrl: _imgUrl}});
    }

    static addCourse(_email, _courseName, _semester, _year) {
        const db = getDb();
        const newCourse = {
            courseName: _courseName,
            semester: _semester,
            year: _year
        };
        return User.findByEmail(_email)
        .then(user => {
            const allCourses = user.courses;
            allCourses.push(newCourse);
            return db.collection('users').updateOne({email: _email}, {$set: {courses: allCourses}})
        })
        .catch(err => {
            throw err;
        });
    }

    static findByEmail(_email) {
        const db = getDb();
        return db.collection('users').findOne({email: _email});
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('users').find().toArray()
        .then(result => {
            return result
        })
        .catch(err => {
            console.log('CANNOT FETCH DATA');
        });
    }

    static hasAccess(_email, _pass) {
        let _hasAccess = false;
        return User.fetchAll()
        .then(users => {
            //go through every user
            
            for (let i = 0; i < users.length; i++) {
                if(users[i].email == _email && users[i].password == _pass) {
                    _hasAccess = true;
                    return _hasAccess;
                }
            }
            //in case it failed to find the user
            return _hasAccess;
        })
        .catch(err => {
            throw err;
        });
    }

    static deleteCourse(user, _courseName) {
        const db = getDb();

        for (let i = 0; i < user.courses.length; i++) {
            if(user.courses[i].courseName == _courseName) {
                user.courses.splice(i, 1);
            }
        }
        return db.collection('users').updateOne({_id: new mongodb.ObjectId(user._id)}, {$set: {courses: user.courses}});
    }
}

module.exports = User;