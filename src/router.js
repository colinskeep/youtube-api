const express = require('express');
const router = new express.Router();
const exampleRoute = require('./v1/routes/example.js');
const healthRoute = require('./v1/routes/health.js');

router.use('/api/v1/example', exampleRoute);
router.use('/api/v1/health', healthRoute);

module.exports = router;
