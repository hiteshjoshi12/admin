const express = require('express');
const router = express.Router();
const { getCollections, createCollection } = require('../controllers/collectionController');

router.route('/').get(getCollections).post(createCollection);

module.exports = router;