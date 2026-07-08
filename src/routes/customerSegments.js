const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/customerSegmentsController');

router.get('/', ctrl.index);
router.post('/reorder', ctrl.reorder);
router.get('/:id', ctrl.show);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.destroy);

router.post('/:id/entry-events', ctrl.createEntryEvent);
router.delete('/:id/entry-events/:eventId', ctrl.destroyEntryEvent);

router.post('/:id/exit-events', ctrl.createExitEvent);
router.delete('/:id/exit-events/:eventId', ctrl.destroyExitEvent);

router.post('/:id/email-series', ctrl.assignEmailSeries);
router.delete('/:id/email-series/:seriesId', ctrl.unassignEmailSeries);
router.post('/:id/queries', ctrl.createQuery);
router.put('/:id/queries/:queryId', ctrl.updateQuery);
router.delete('/:id/queries/:queryId', ctrl.destroyQuery);
module.exports = router;
