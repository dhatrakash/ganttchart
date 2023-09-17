const express = require('express');
const hardwareController = require('../../controllers/hardware.controller');

const router = express.Router();
// route for finding data from desired time span by post method
router.post('/send', hardwareController.getDataByTimeFrame);
// route for finding data from desired time span by get method
router.get('/send', hardwareController.getDataByTimeFrame1);
// route for fetching data of part count of all machine.
router.get('/part/:interval/:date', hardwareController.partProduceTable);
// route for fetching data of OEE,Parts Count,Performance Time,ideal time
router.get('/oee/:datetime/:mac', hardwareController.oeeChart);
// route for fetching data of OEE of all machine.
router.get('/oee/:date', hardwareController.companyOEE);
// route for fetching data for pdf generation
router.get('/:date', hardwareController.pdfGenerator);
// route for creating hardwareData api for mayur
router.post('/addhardwareData', hardwareController.createHardware);

module.exports = router;
