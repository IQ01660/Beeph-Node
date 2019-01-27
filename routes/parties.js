//all imports
const express = require('express');
const router = express.Router();

//all controllers
const partiesControllers = require('./../controllers/parties');

//all routes

// /parties/all-parties => GET
router.get('/all-parties', partiesControllers.getAllParties);

// /parties/add-party => POST
router.post('/add-party', partiesControllers.postAddParty);

// /parties/add-attendant => POST
router.post('/add-attendant', partiesControllers.postAddAttendant);

// /parties/delete-party => POST
router.post('/delete-party', partiesControllers.postDeleteParty);

//all exports
module.exports = router;