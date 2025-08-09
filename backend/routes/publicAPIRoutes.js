const express = require('express');
const { getFloweringCNT, getForecastCNT } = require('../controllers/publicAPIController');

const router = express.Router();

router.get('/getFlowering', getFloweringCNT);
router.get('/getForecast', getForecastCNT);

module.exports = router;
