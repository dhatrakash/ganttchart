const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
  observation: {
    time: Number,
    machine: String,
    name: String,
    marker: [
      {
        type: String,
        number: Number,
      },
    ],
  },
});

const timerSchema = new mongoose.Schema({
  poweron_min: Number,
  operating_min: Number,
  cutting_min: Number,
});

const overrideSchema = new mongoose.Schema({
  feed: Number,
  rapid: Number,
  spindle: Number,
});

const modalSchema = new mongoose.Schema({
  m1: Number,
  m2: Number,
  m3: Number,
  t: Number,
});
const stateDataSchema = new mongoose.Schema({
  mode: String,
  execution: String,
  aut: Number,
  run: Number,
  motion: Number,
  mstb: Number,
  emergency: Number,
  alaram: Number,
  timers: timerSchema,
  override: overrideSchema,
  modal: modalSchema,
});

const stateSchema = new mongoose.Schema({
  time: {
    type: Number,
    decimal: true,
  },
  data: stateDataSchema,
});

const controllerSchema = new mongoose.Schema({
  observation: observationSchema,
  state: stateSchema,
});
const controller = mongoose.model('Controller', controllerSchema);

module.exports = controller;
