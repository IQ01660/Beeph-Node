//all imports
const express = require('express');
const router = express.Router();

//all controllers
const studentsControllers = require('./../controllers/students');

// /students/student-search => GET
router.get('/student-search', studentsControllers.getStudentSearch);

// /students/student-search => POST
router.post('/student-search', studentsControllers.postStudentSearch);

//all exports
module.exports = router;