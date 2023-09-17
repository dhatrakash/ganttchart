const mongoose = require('mongoose');

const ioSchema = mongoose.Schema({
  diId: {
    type: String,
    default: 'new',
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
    unique: true,
  },
  // multiple sensors withing one slave
  connectedSensors: [
    {
      sensorId: mongoose.Schema.Types.ObjectId,
      tag: String,
    },
  ],
});

const gatewaySchema = mongoose.Schema({
  gatewayId: {
    type: String,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  },
  macId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  port: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
  },
  // multiple slaves in one gateway
  slaves: [slavesSchema], // Use the schema directly here
  inputs: [ioSchema], // You can do the same for ioSchema
});

// func to update date whenever isActive status is changed
gatewaySchema.pre('save', function (next) {
  if (this.isModified('isActive')) {
    this.updatedDate = new Date();
  }
  next();
});
const Gateway = mongoose.model('Gateway', gatewaySchema);

module.exports = Gateway;
