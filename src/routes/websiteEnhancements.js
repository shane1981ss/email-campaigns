const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/websiteEnhancementsController');

router.post('/reorder', ctrl.reorder);
router.get('/', ctrl.index);
router.post('/', ctrl.create);
router.get('/tasks/:id', ctrl.show);
router.post('/tasks/:id/reorder', ctrl.reorderTasks);
router.post('/tasks/:id', ctrl.createTask);
router.put('/tasks/:id/:taskId', ctrl.updateTask);
router.delete('/tasks/:id/:taskId', ctrl.destroyTask);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.destroy);

module.exports = router;
