const Sensor = require('../models/sensor.model');

// Create a new sensor
const createSensor = async (sensorData) => {
  try {
    return await Sensor.create(sensorData);
  } catch (error) {
    throw new Error(`Failed to create sensor: ${error.message}`);
  }
};

// Find a sensor by sensorId
const findSensorById = async (id) => {
  try {
    const sensor = await Sensor.findOne({ sensorId: id });
    return sensor;
  } catch (error) {
    throw new Error(`Failed to find sensor: ${error.message}`);
  }
};

// Find all sensors
const findAllSensors = async () => {
  try {
    const sensors = await Sensor.find();
    return sensors;
  } catch (error) {
    throw new Error(`Failed to find sensors: ${error.message}`);
  }
};

// Update a sensor by sensorId
const updateSensor = async (sensorId, updatedSensorData) => {
  try {
    const sensor = await Sensor.findOneAndUpdate({ sensorId }, updatedSensorData, { new: true });
    return sensor;
  } catch (error) {
    throw new Error(`Failed to update sensor: ${error.message}`);
  }
};

// Delete a sensor by sensorId
const deleteSensor = async (sensorId) => {
  try {
    const sensor = await Sensor.findOneAndDelete({ sensorId });
    return sensor;
  } catch (error) {
    throw new Error(`Failed to delete sensor: ${error.message}`);
  }
};

module.exports = {
  createSensor,
  findSensorById,
  findAllSensors,
  updateSensor,
  deleteSensor,
};
