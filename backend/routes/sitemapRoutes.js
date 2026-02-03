const express = require('express');
const router = express.Router();
const { getSitemap } = require('../controllers/sitemapController');

router.get('/sitemap.xml', getSitemap);

module.exports = router;