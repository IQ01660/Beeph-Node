//all mongo imports
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//the database pool
let _db;

//handling the connection
const mongoConnect = (callback) => {
    //username: ikram_local
    //password: 2001021Ika
    //database name: beephOne
    MongoClient.connect("mongodb+srv://ikram_local:2001021Ika@beephcluster1-703lk.mongodb.net/beephOne?retryWrites=true")
    .then(client => {
        //assigning the database
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log('PROBLEMS CONNECTING TO THE DATABASE');
    });
}

//function return _db 
//only if connection was established
const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'NO DATABASE FOUND';
}


//all exports
module.exports = {
    mongoConnect: mongoConnect,
    getDb: getDb
}