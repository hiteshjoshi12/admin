const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, sendContactEmail);

module.exports = router;