const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  unit: String, // unit for measurment
  scale: Number, // factor for conversion
  sourceUnit: String, // unit before conversion
  targetUnit: String, // unit after conversion
  formula: String, // formula for conversion
  precision: Number, // how many decimal places
  description: String, // description about conversion
});

const sensorSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  },
  sensorName: {
    type: String,
    required: true,
  },
  sensorType: {
    type: String,
    required: true,
  },
  location: String,
  manufacturer: String,
  model: String,
  serialNumber: String,
  calibrationDate: Date,
  accuracy: String,
  measurementRange: String,
  operatingTemperature: String,
  powerSupply: String,
  dataFormat: String,
  sensorStatus: String,
  sensorDescription: String,
  conversion: [conversionSchema],
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
