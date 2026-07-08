const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/emailsController');

router.get('/', ctrl.index);
router.post('/reorder', ctrl.reorder);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
