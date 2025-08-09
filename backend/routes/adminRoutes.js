const express = require('express');
const router = express.Router();
const { requireAuth, requireRole } = require('../services/middleware')
const ctrl = require('../controllers/tasksController');

router.use(requireAuth, requireRole('administrator'));

router.get('/tasks', ctrl.getTasks);

module.exports = router;
