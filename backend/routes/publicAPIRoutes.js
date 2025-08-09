const express = require('express');
const { getAQ , getForecastCNT } = require('../controllers/publicAPIController');

const router = express.Router();

router.get('/getAirQuality', getAQ);
router.get('/getForecast', getForecastCNT);

module.exports = router;
