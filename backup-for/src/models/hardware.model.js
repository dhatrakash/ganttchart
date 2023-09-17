const mongoose = require('mongoose');
const moment = require('moment/moment');

// func to set data utc and change format
const setDtm = (dtm) => {
  if (dtm instanceof Date) {
    return dtm.toISOString();
  }
  if (typeof dtm === 'string') {
    const date = moment.utc(dtm, 'YYYYMMDDHHmmss').format();
    if (date !== 'Invalid date') {
      return date;
    }
  }
  return dtm;
};

// this schema helpful for  saving multiple slaves and sensors
const modbusSchema = new mongoose.Schema({
  sid: {
    type: Number,
    required: true,
  },
  // here comes sensor id or name and it's value
});

const hardwareSchema = new mongoose.Schema({
  data: {
    mac: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // distinguish between hardwire and controller models
    machine_type: {
      type: String,
      enum: ['hardwire', 'controller'],
    },
    uid: {
      type: Number,
      required: false,
      trim: true,
      index: true,
    },
    dtm: {
      type: String,
      required: true,
      index: true,
      set: setDtm,
    },
    seq: Number,
    sig: Number,
    msg: String,
    io: {
      // di1 => machine_status
      di1: {
        type: Number,
        default: 0,
        alias: 'machine_status',
      },
      // di2 => cycle_status
      di2: {
        type: Number,
        default: 0,
        alias: 'cycle_status',
      },
      a1: {
        type: Number,
        decimal: true,
      },
      a2: {
        type: Number,
        decimal: true,
      },
      s1: Number,
      p1: Number,
    },
    sysv: {
      type: Number,
      decimal: true,
    },
    modbus: {
      type: [modbusSchema],
    },
  },
});

const Hardware = mongoose.model('Hardware', hardwareSchema);

module.exports = Hardware;
