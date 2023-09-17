const sensorService = require('../services/sensor.service');

exports.createSensor = async (req, res) => {
  try {
    const createdSensor = await sensorService.createSensor(req.body);
    return res.status(201).json({ createdSensor });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.findSensorById = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const sensor = await sensorService.findSensorById(sensorId);
    if (sensor) return res.status(201).json(sensor);
    return res.status(404).json({ error: `sensor not found` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.findAllSensors = async (req, res) => {
  try {
    const sensors = await sensorService.findAllSensors();
    if (sensors[0]) return res.status(201).json(sensors);
    return res.status(404).json({ error: `sensors not found` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const sensorData = req.body;
    const updatedSensor = await sensorService.updateSensor(sensorId, sensorData);
    if (updatedSensor) return res.status(201).json(updatedSensor);
    return res.status(404).json({ error: 'Sensor not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const deletedSensor = await sensorService.deleteSensor(sensorId);
    if (deletedSensor) return res.status(200).json(deletedSensor);
    return res.status(404).json({ error: 'Sensor not found' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
