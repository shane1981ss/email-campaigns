const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/shopifyWebhookEventsController');

router.get('/', ctrl.index);

module.exports = router;
