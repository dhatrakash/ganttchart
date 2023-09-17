const mongoose = require('mongoose');

const ioSchema = mongoose.Schema({
  diId: {
    type: String,
    index: true,
    required: true,
  },
  sensorId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  tag: String,
});

const slavesSchema = mongoose.Schema({
  sid: {
    type: String,
    index: true,
    required: true,
  },
  // multiple sensors withing one slave
  connectedSensors: [
    {
      sensorId: mongoose.Schema.Types.ObjectId,
      tag: String,
    },
  ],
});

// nested machine_ status mapping for ideal & productive
const statusMappingSchema = mongoose.Schema({
  idle: {
    type: Number,
    default: 0,
    requried: true,
  },
  productive: {
    type: Number,
    default: 1,
    requried: true,
  },
});

const machineSchema = mongoose.Schema({
  machineName: {
    type: String,
    required: true,
  },
  machineId: {
    type: String,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  },
  // assign which gateway
  gatewayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gateway',
  },
  machine_type: {
    type: String,
    enum: ['hardwire', 'controller'],
    requried: true,
  },
  machineLocation: String,
  machineMake: String,
  mfgEmail: String,
  machineMakeYear: Number,
  machineWarranty: Number,
  maintenancePerson: String,
  machinePhoto: {
    base64: Buffer,
    contentType: String,
  },
  controllerMake: String,
  controllerMakeYear: Number,
  controllerPhoto: {
    base64: Buffer,
    contentType: String,
  },
  powerSupplyRating: Number,
  inputMethod: {
    type: String,
    enum: ['STABILIZER', 'UPS', 'OTHER'],
  },
  attributes: [slavesSchema],
  inputs: [ioSchema],
  statusMapping: {
    type: statusMappingSchema,
    default: {
      idle: 0,
      productive: 1,
    },
  },
});

const Machine = mongoose.model('Machine', machineSchema);

module.exports = Machine;

// dropdown gateway select one gateway => findall gateways
// dropdown select machine from dropdown=>  findallmachineby gatewayId / macId
// find hardware data of machine or mac =>
