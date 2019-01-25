//variable
const PORT = 3066;

//all default imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
//all custom imports
const databaseMethods = require('./util/database');

//importing the routers
const welcomeRoutes = require('./routes/welcome');
const userRoutes = require('./routes/user');

//creating the app
const app = express();

//fileStorage for multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadedImages');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
//fileFilter for multer
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

//showing the static folder => public and uploadedImages
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploadedImages', express.static(path.join(__dirname,'uploadedImages')));

//setting the bodyParser for request bodies
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('imageInput'));

//setting ejs config
app.set('view engine', 'ejs');
app.set('views', 'views');




//running all imported routes
app.use('/user', userRoutes);
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

