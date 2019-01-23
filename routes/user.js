//all imports
const express = require('express');
const router = express.Router();

//controllers
const userControllers = require('./../controllers/user');


// /user/my-beeph => GET
router.get('/my-beeph', userControllers.getMyBeeph);

// /user/my-beeph => POST
router.post('/my-beeph', userControllers.postMyBeeph);

// /user/my-beeph/save-about-me => POST
router.post('/my-beeph/save-about-me', userControllers.postMyBeephAboutMe);

module.exports = router;