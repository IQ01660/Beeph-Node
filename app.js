//variable
const PORT = 3666;

//all default imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//all custom imports
const databaseMethods = require('./util/database');

//importing the routers
const welcomeRoutes = require('./routes/welcome');

//creating the app
const app = express();

//showing the static folder => public
app.use(express.static(path.join(__dirname,'public')));

//setting the bodyParser for request bodies
app.use(bodyParser.urlencoded({extended: false}));

//setting ejs config
app.set('view engine', 'ejs');
app.set('views', 'views');




//running all imported routes
app.use(welcomeRoutes);




//404 route
app.use((req, res, next) => {
    res.status(404).render('error.ejs', {
        pageTitle: "Not Found"
    });
})

//connecting to database
//and launching the app
databaseMethods.mongoConnect(() => {
    app.listen(PORT);
});

