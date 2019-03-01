const express = require('express');
const validate = require('express-validation');
const exampleController = require('../controllers/example.js');
const router = new express.Router();

const postExample = require('./validators/example.js');

router.route('/example/').post(
    validate(postExample.validate), exampleController.youtube);

module.exports = router;
