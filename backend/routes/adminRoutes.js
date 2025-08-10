const express = require('express');
const router = express.Router();
const { requireAuth, requireRole, } = require('../services/middleware')
const ctrl = require('../controllers/tasksController');
const usersCtrl = require('../controllers/usersController')

router.use(requireAuth, requireRole('administrator'));

router.get('/tasks', ctrl.getTasks);
router.get('/comments', ctrl.getComments);
router.get('/completed', ctrl.getCompleted);
router.get('/users', usersCtrl.getBeekeepers);
router.get('/beeCalendar', ctrl.beekeeperCalendarCNT);
router.get('/tasks/future', ctrl.getFutureTasksCNT);
router.post('/task-assign', ctrl.assignExistingTaskCNT);
router.post('/task-create-assign', ctrl.createAndAssignTaskCNT);

module.exports = router;