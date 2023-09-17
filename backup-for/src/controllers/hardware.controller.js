const hardwareService = require('../services/hardware.service');

exports.getDataByTimeFrame = async function (req, res) {
  try {
    const foundData = await hardwareService.findDataByTimeFrame(req.body);
    res.status(200).json({ message: 'These are matching Records from hardware-routes', foundData });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });

    throw error;
  }
};

exports.getDataByTimeFrame1 = async function (req, res) {
  try {
    const foundData = await hardwareService.findDataByTimeFrame1(req.query);
    res.status(200).json({ message: 'These are matching Records from hardware-routes', foundData });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });

    throw error;
  }
};

exports.partProduceTable = async (req, res) => {
  const { interval, date } = req.params;
  try {
    const data = await hardwareService.fetchDataByTimeInterval(interval, date);
    res.status(200).json({ message: 'Matching Records', data });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

exports.oeeChart = async function (req, res) {
  const selectedDateTime = req.params.datetime;
  const mac = req.params.mac;
  try {
    const machineData = await hardwareService.oeeCalculation(selectedDateTime, mac);

    res.status(200).json({ message: 'These are matching Records from hardware-routes', machineData });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
};

exports.companyOEE = async function (req, res) {
  const selectedDateTime = req.params.date;

  try {
    const oeeData = await hardwareService.allMachineOEE(selectedDateTime);

    res.status(200).json({ message: 'These are matching Records from hardware-routes', oeeData });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
};

exports.pdfGenerator = async function (req, res) {
  const date = req.params.date;
  try {
    const dataForPDF = await hardwareService.dataForPDF(date);

    res.status(200).json({ message: 'These are matching Records from hardware-routes', dataForPDF });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
};

exports.createHardware = async (req, res) => {
  try {
    const createdHardware = await hardwareService.createHardware(req.body);
    res.status(201).json(createdHardware);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
