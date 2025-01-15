const express = require('express');
const { startStream, stopStream } = require('../controllers/streamController');

const router = express.Router();

router.get('/start', startStream);
router.get('/stop', stopStream);

module.exports = router;
